// API Base URL
import { API_BASE, API_VERSION } from "./config.js";

// DOM Elements
const urlForm = document.getElementById('urlForm');
const urlInput = document.getElementById('urlInput');
const urlError = document.getElementById('urlError');
const successResult = document.getElementById('successResult');
const errorResult = document.getElementById('errorResult');
const shortenedUrl = document.getElementById('shortenedUrl');
const originalUrl = document.getElementById('originalUrl');
const historyList = document.getElementById('historyList');
const loadingIndicator = document.getElementById('loadingIndicator');

// Initialize App
document.addEventListener('DOMContentLoaded', function () {
    loadHistory();
});

// Functions to show/hide elements
function showUrlError(message) {
    urlError.textContent = message;
    urlError.classList.remove('hidden');
}

function clearUrlError() {
    urlError.textContent = '';
    urlError.classList.add('hidden');
}

function showSuccess(original, shortCode) {
    originalUrl.textContent = original;
    originalUrl.href = original;
    shortenedUrl.textContent = `${API_BASE}/${shortCode}`;
    shortenedUrl.href = `${API_BASE}/${shortCode}`;
    successResult.classList.remove('hidden');
}

function showError(message) {
    errorResult.textContent = message;
    errorResult.classList.remove('hidden');
}

function showLoading() {
    loadingIndicator.classList.remove('hidden');
}

function hideLoading() {
    loadingIndicator.classList.add('hidden');
}

// Function to validate URL format
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;
    }
}

// Function to add to history
function addToHistory(shortCode, original) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `<a href="${API_BASE + '/' + shortCode}" target="_blank">${shortCode}</a> - <a href="${original}" target="_blank">Original</a>`;
    historyList.appendChild(listItem);
}

// Form submission
urlForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const destination = urlInput.value.trim();

    // Clear previous states
    clearUrlError();
    successResult.classList.add('hidden');
    errorResult.classList.add('hidden');

    // Validate URL
    if (!isValidUrl(destination)) {
        showUrlError('Please enter a valid URL');
        return;
    }

    showLoading();

    try {
        // Create form data for form-urlencoded
        const formData = new URLSearchParams();
        formData.append('destination', destination);

        const response = await fetch(`${API_BASE}/${API_VERSION}/urls/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-user-id': getUserId()
            },
            body: formData
        });

        if (response.status !== 201) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const shortCode = data.source;

        if (shortCode) {
            showSuccess(destination, shortCode);
            addToHistory(shortCode, destination);
            urlInput.value = '';
            saveToHistory(shortCode, destination);
        } else {
            throw new Error('Invalid response from server');
        }

    } catch (err) {
        console.error('Error shortening URL:', err);
        showError(err.message || 'Failed to shorten URL. Please try again.');
    } finally {
        hideLoading();
    }
});

// Function to get a user id, create a new random one if doesn't exists
function getUserId() {
    let userId = localStorage.getItem('user-id');
    if (userId) return userId;

    userId = Date.now();
    localStorage.setItem('user-id', userId);

    return userId;
}

// Load history from localStorage
function loadHistory() {
    const saved = localStorage.getItem('url-history');
    if (!saved) return;

    const urlHistory = JSON.parse(saved);
    for (const key in urlHistory) {
        addToHistory(key, urlHistory[key]);
    }
}

// Save history to localStorage
function saveToHistory(shortCode, original) {
    const saved = localStorage.getItem('url-history') ?? '{}';
    if (!saved) {
        localStorage.setItem('url-history', JSON.stringify({}));
    };

    let urlHistory = JSON.parse(saved);
    urlHistory[shortCode] = original;
    localStorage.setItem('url-history', JSON.stringify(urlHistory));
}