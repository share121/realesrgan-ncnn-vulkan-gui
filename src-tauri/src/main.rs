// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use base64::{engine::general_purpose, Engine as _};
use std::{
    fs::File,
    io::{prelude::*, BufRead, BufReader},
    path::Path,
    process::{Command, Stdio},
    sync::{Arc, Mutex},
    thread,
};
use tauri::{Manager, Window};
use window_shadows::set_shadow;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
async fn file_to_base64(path: String) -> Result<String, String> {
    let mut buffer: Vec<u8> = Vec::new();
    File::open(path)
        .map_err(|e| e.to_string())?
        .read_to_end(&mut buffer)
        .map_err(|e| e.to_string())?;
    Ok(general_purpose::STANDARD.encode(buffer))
}

async fn start_realesrgan_ncnn_vulkan(
    path: &str,
    input_path: &str,
    output_path: &str,
    scale: &str,
    model_path: &str,
    model_name: &str,
) -> Command {
    let mut command = Command::new(path);
    if cfg!(target_os = "windows") {
        #[cfg(target_os = "windows")]
        use std::os::windows::process::CommandExt;
        #[cfg(target_os = "windows")]
        command.creation_flags(0x08000000);
    }
    command.args([
        "-i",
        input_path,
        "-o",
        output_path,
        "-s",
        scale,
        "-m",
        model_path,
        "-n",
        model_name,
    ]);
    command
}

#[tauri::command]
async fn start_work(
    window: Window,
    realesrgan_ncnn_vulkan_path: String,
    input_path: String,
    output_path: String,
    scale: String,
    model_path: String,
    model_name: String,
    id: String,
) -> Result<(), String> {
    let mut command = start_realesrgan_ncnn_vulkan(
        &realesrgan_ncnn_vulkan_path,
        &input_path,
        &output_path,
        &scale,
        &model_path,
        &model_name,
    )
    .await;
    let child = Arc::new(Mutex::new(
        command
            .stderr(Stdio::piped())
            .spawn()
            .map_err(|e| e.to_string())?,
    ));
    let window = Arc::new(Mutex::new(window));
    let handle;
    let output = Arc::new(Mutex::new(String::new()));
    {
        let child = Arc::clone(&child);
        let window = Arc::clone(&window);
        let output = Arc::clone(&output);
        let id = id.clone();
        handle = thread::spawn(move || -> Result<(), String> {
            let stdout = child
                .lock()
                .map_err(|e| e.to_string())?
                .stderr
                .take()
                .ok_or("stderr 是空的".to_string())?;
            let reader = BufReader::new(stdout);
            reader
                .lines()
                .filter_map(|line| line.ok())
                .try_for_each(|line| {
                    output
                        .lock()
                        .map_err(|e| e.to_string())?
                        .push_str(&format!("{}\n", line));
                    window
                        .lock()
                        .map_err(|e| e.to_string())?
                        .emit(&id, line)
                        .map_err(|e| e.to_string())
                })
                .map_err(|e| e.to_string())?;
            Ok(())
        });
    }
    {
        let child = Arc::clone(&child);
        let id = id.clone();
        window
            .lock()
            .map_err(|e| e.to_string())?
            .once(format!("{}stop", id), move |_| {
                let _ = child.lock().map(|mut c| c.kill());
            });
    }
    let _ = handle.join();
    {
        let child = Arc::clone(&child);
        let output = Arc::clone(&output);
        match child
            .lock()
            .map_err(|e| e.to_string())?
            .wait()
            .map_err(|e| e.to_string())?
            .success()
        {
            true => Ok("".to_string()),
            false => Err(match output.lock() {
                Ok(data) => data.to_string(),
                Err(e) => e.to_string(),
            }),
        }?;
    }
    window
        .lock()
        .map_err(|e| e.to_string())?
        .emit(&id, "")
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
async fn is_dir(path: String) -> bool {
    Path::new(&path).is_dir()
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(any(windows, target_os = "macos"))]
            set_shadow(&app.get_window("main").unwrap(), true).expect("Unsupported platform!");
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![start_work, file_to_base64, is_dir])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
