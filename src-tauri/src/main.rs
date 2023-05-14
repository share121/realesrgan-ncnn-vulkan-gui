// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use base64::{engine::general_purpose, Engine as _};
use std::fs::File;
use std::io::prelude::*;
use std::{
    io::{BufRead, BufReader},
    process::{Command, Stdio},
};
use tauri::Window;

#[derive(Clone, serde::Serialize)]
struct Payload {
    done: bool,
    data: String,
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
async fn file_to_base64(path: String) -> Result<String, String> {
    let mut inputfile = File::open(path).map_err(|e| e.to_string())?;
    let mut buffer: [u8; 16] = [0; 16];
    let mut output_buf: Vec<u8> = vec![];
    while let std::io::Result::Ok(len) = inputfile.read(&mut buffer) {
        if len == 0 {
            break;
        } else {
            output_buf.append(&mut buffer.to_vec());
        }
    }
    let b64 = general_purpose::STANDARD.encode(output_buf);
    Ok(b64)
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
    let stdout = Command::new(realesrgan_ncnn_vulkan_path)
        .args([
            "-i",
            &input_path,
            "-o",
            &output_path,
            "-s",
            &scale,
            "-n",
            &model_name,
        ])
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| e.to_string())?
        .stderr
        .take()
        .unwrap();
    let reader = BufReader::new(stdout);
    reader
        .lines()
        .filter_map(|line| line.ok())
        .try_for_each(|line| {
            window.emit(
                &id,
                Payload {
                    done: false,
                    data: line,
                },
            )
        })
        .map_err(|e| e.to_string())?;
    window
        .emit(
            &id,
            Payload {
                done: true,
                data: "".into(),
            },
        )
        .map_err(|e| e.to_string())?;
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![start_work, file_to_base64])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
