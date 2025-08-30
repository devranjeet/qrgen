document.addEventListener('DOMContentLoaded', () => {
    const qrForm = document.getElementById('qr-form');
    const dataInput = document.getElementById('data-input');
    const qrCodeContainer = document.getElementById('qr-code-container');
    const downloadBtn = document.getElementById('download-btn');
    const errorMessage = document.getElementById('error-message');
    const loader = document.getElementById('loader');
    const qrPlaceholder = document.getElementById('qr-placeholder');

    qrForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const data = dataInput.value.trim();
        if (!data) {
            displayError('Please enter a URL or text.');
            return;
        }
        resetUI();
        loader.classList.remove('hidden');
        qrPlaceholder.classList.add('hidden');
        
        try {
            const response = await fetch('/generate_qr', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: data }),
            });

            loader.classList.add('hidden');

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate QR code.');
            }

            const result = await response.json();
            displayQRCode(result.qr_code_image);

        } catch (error) {
            loader.classList.add('hidden');
            displayError(error.message);
            console.error('Error:', error);
        }
    });

    function displayQRCode(imageBase64) {
        qrCodeContainer.innerHTML = '';
        const img = document.createElement('img');
        img.src = imageBase64;
        img.alt = 'Generated QR Code';
        qrCodeContainer.appendChild(img);
        
        downloadBtn.href = imageBase64;
        downloadBtn.classList.remove('hidden');
    }
    
    function displayError(message) {
        resetUI();
        errorMessage.textContent = message;
    }
    
    function resetUI() {
        errorMessage.textContent = '';
        downloadBtn.classList.add('hidden');
        qrCodeContainer.innerHTML = '';
        qrCodeContainer.appendChild(qrPlaceholder);
        qrCodeContainer.appendChild(loader);
        qrPlaceholder.classList.remove('hidden');
    }
});