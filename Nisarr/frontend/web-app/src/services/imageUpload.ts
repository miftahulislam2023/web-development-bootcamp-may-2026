export async function uploadImage(file: File): Promise<string> {
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
    if (!apiKey) {
        throw new Error("ImgBB API key is missing. Please add VITE_IMGBB_API_KEY to your .env file.");
    }

    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error?.message || "Failed to upload image");
    }

    const data = await response.json();
    return data.data.url;
}
