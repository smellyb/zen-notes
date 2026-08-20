fn main() {
    if let Err(err) = tauri_build::try_build(tauri_build::Attributes::new()) {
        eprintln!("Warning: tauri_build helper returned an error: {err}");
    }
}
