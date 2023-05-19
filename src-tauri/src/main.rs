// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use base64::{engine::general_purpose, Engine as _};
use std::{
    fs::File,
    io::{prelude::*, BufRead, BufReader},
    process::{Command, Stdio},
    sync::{Arc, Mutex},
    thread,
};
use tauri::Window;

#[derive(Clone, serde::Serialize)]
struct Payload {
    data: String,
}

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

fn start_realesrgan_ncnn_vulkan(
    path: &str,
    input_path: &str,
    output_path: &str,
    scale: &str,
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
        &scale.to_string(),
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
    model_name: String,
    id: String,
) -> Result<(), String> {
    let mut command = start_realesrgan_ncnn_vulkan(
        &realesrgan_ncnn_vulkan_path,
        &input_path,
        &output_path,
        &scale,
        &model_name,
    );
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
            let stdout = match child.lock().map_err(|e| e.to_string())?.stderr.take() {
                Some(x) => Ok(x),
                None => Err("stderr 是空的".to_string()),
            }?;
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
                        .emit(&id, Payload { data: line })
                        .map_err(|e| e.to_string())
                })
                .map_err(|e| e.to_string())?;
            Ok(())
        });
    }
    {
        let child = Arc::clone(&child);
        window
            .lock()
            .map_err(|e| e.to_string())?
            .once(format!("{}stop", id), move |_| {
                child.lock().unwrap().kill().unwrap();
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
        .emit(&id, Payload { data: "".into() })
        .map_err(|e| e.to_string())?;
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![start_work, file_to_base64])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
