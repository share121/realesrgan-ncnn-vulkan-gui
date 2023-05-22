// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
async fn file_to_base64(path: String) -> Result<String, String> {
    use base64::{engine::general_purpose, Engine as _};
    use tokio::{fs::File, io::AsyncReadExt};
    let mut buffer: Vec<u8> = Vec::new();
    File::open(path)
        .await
        .map_err(|e| e.to_string())?
        .read_to_end(&mut buffer)
        .await
        .map_err(|e| e.to_string())?;
    Ok(general_purpose::STANDARD.encode(buffer))
}

#[tauri::command]
async fn start_work(
    app_handle: tauri::AppHandle,
    window: tauri::Window,
    input_path: String,
    output_path: String,
    scale: String,
    model_name: String,
    id: String,
) -> Result<(), String> {
    use regex::Regex;
    use std::sync::{Arc, Mutex};
    use tauri::api::process::{Command, CommandEvent};
    let model_path = app_handle
        .path_resolver()
        .resolve_resource("resources/models/")
        .ok_or("connot find `resources/models`".to_string())?
        .to_string_lossy()
        .to_string();
    let model_path = Regex::new(r"^\\\\\?\\(.*)$")
        .expect("failed to create `Regex`")
        .replace(&model_path, "$1");
    println!("{}", model_path);
    let window = Arc::new(Mutex::new(window));
    let (mut rx, child) = Command::new_sidecar("realesrgan")
        .map_err(|_| "failed to create `realesrgan` binary command")?
        .args([
            "-i",
            &input_path,
            "-o",
            &output_path,
            "-s",
            &scale,
            "-m",
            &model_path,
            "-n",
            &model_name,
        ])
        .spawn()
        .map_err(|_| "failed to create `realesrgan` binary command")?;
    let stop_id = window
        .lock()
        .map_err(|e| e.to_string())?
        .once(format!("{}stop", id), |_| {
            child.kill().expect("failed to kill realesrgan");
        });
    {
        let window = window.clone();
        tauri::async_runtime::spawn(async move {
            // read events such as stdout
            while let Some(event) = rx.recv().await {
                if let CommandEvent::Stderr(line) = event {
                    println!("{line}");
                    window
                        .lock()
                        .expect("connot lock `window`")
                        .emit(&id, &line)
                        .expect("failed to emit event");
                }
            }
        })
    }
    .await
    .map_err(|e| e.to_string())?;
    window.lock().map_err(|e| e.to_string())?.unlisten(stop_id);
    Ok(())
}

#[tauri::command]
fn is_dir(path: String) -> bool {
    use std::path::Path;
    Path::new(&path).is_dir()
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(any(windows, target_os = "macos"))]
            {
                use tauri::Manager;
                use window_shadows::set_shadow;
                set_shadow(
                    &app.get_window("main").expect("cannot get window `main`"),
                    true,
                )
                .expect("unsupported platform!");
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![start_work, file_to_base64, is_dir])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
