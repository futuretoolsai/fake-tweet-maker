/**
 * Fake Tweet Maker - Main JavaScript
 * This file handles all interactive functionality of the fake tweet generator
 */

// Wait for DOM to be fully loaded before executing
document.addEventListener('DOMContentLoaded', function() {
    console.log('Document loaded, initializing tweet maker...');
    
    // Set current date and time as default values
    initializeDateTime();
    
    // Set up event listeners for all input fields
    setupEventListeners();
    
    // Set up file upload handlers
    setupFileUploads();
    
    // Initialize the preview with default values
    updatePreview();
    
    // Set up download and copy buttons
    setupActionButtons();
    
    console.log('Tweet maker initialization complete');
});

/**
 * Initialize date and time fields with current values
 */
function initializeDateTime() {
    console.log('Setting default date and time');
    const now = new Date();
    
    // Set date input value
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        dateInput.value = `${year}-${month}-${day}`;
    }
    
    // Set time input value
    const timeInput = document.getElementById('time');
    if (timeInput) {
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        timeInput.value = `${hours}:${minutes}`;
    }
}

/**
 * Set up event listeners for all input elements
 */
function setupEventListeners() {
    console.log('Setting up event listeners');
    
    // Add input event listeners to all form elements
    const formElements = document.querySelectorAll('input, textarea, select');
    formElements.forEach(element => {
        element.addEventListener('input', function() {
            console.log(`Input detected on ${element.id}`);
            updatePreview();
        });
        
        // Also add change event for select and checkbox elements
        if (element.tagName === 'SELECT' || element.type === 'checkbox') {
            element.addEventListener('change', function() {
                console.log(`Change detected on ${element.id}`);
                updatePreview();
            });
        }
    });
}

/**
 * Set up file upload handlers
 */
function setupFileUploads() {
    console.log('Setting up file upload handlers');
    
    // Profile image upload
    setupFileUpload('profileImage', 'profileImagePreview', null, 'profileImageUpload');
    
    // Tweet image upload
    setupFileUpload('tweetImage', 'tweetImagePreview', 'tweetImageContainer', 'tweetImageUpload');
}

/**
 * Set up a file upload input
 * @param {string} inputId - ID of the file input element
 * @param {string} previewId - ID of the img element where preview will be shown
 * @param {string} containerId - Optional ID of container to show/hide
 * @param {string} uploadAreaId - ID of the drag and drop area for visual feedback
 */
function setupFileUpload(inputId, previewId, containerId = null, uploadAreaId = null) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    const container = containerId ? document.getElementById(containerId) : null;
    const uploadArea = uploadAreaId ? document.getElementById(uploadAreaId) : null;
    
    if (!input || !preview) {
        console.error(`Missing elements for ${inputId} setup`);
        return;
    }
    
    input.addEventListener('change', function(e) {
        console.log(`File selected for ${inputId}`);
        const file = e.target.files[0];
        if (!file) {
            console.log('No file selected');
            return;
        }
        
        // Check file size (max 3MB)
        if (file.size > 3 * 1024 * 1024) {
            alert('File size exceeds 3MB limit.');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(event) {
            console.log('File loaded successfully');
            preview.src = event.target.result;
            
            // Show the image container if specified
            if (container) {
                container.style.display = 'block';
            }
            
            // Update the upload area to show the image preview
            if (uploadArea) {
                // Create a thumbnail preview inside the upload area
                const existingPreview = uploadArea.querySelector('.upload-preview');
                if (existingPreview) {
                    existingPreview.remove();
                }
                
                const thumbnail = document.createElement('div');
                thumbnail.className = 'upload-preview';
                thumbnail.style.backgroundImage = `url(${event.target.result})`;
                thumbnail.style.backgroundSize = 'cover';
                thumbnail.style.backgroundPosition = 'center';
                thumbnail.style.width = '80px';
                thumbnail.style.height = '80px';
                thumbnail.style.margin = '5px auto';
                thumbnail.style.borderRadius = inputId === 'profileImage' ? '50%' : '8px';
                thumbnail.style.border = '2px solid #cfd9de';
                
                // Add text below the thumbnail
                const text = document.createElement('p');
                text.textContent = file.name;
                text.style.fontSize = '12px';
                text.style.marginTop = '5px';
                text.style.overflow = 'hidden';
                text.style.textOverflow = 'ellipsis';
                text.style.whiteSpace = 'nowrap';
                text.style.maxWidth = '100%';
                
                // Clear the upload area and add the new preview
                const dragText = uploadArea.querySelector('p');
                if (dragText) {
                    dragText.style.display = 'none';
                }
                
                uploadArea.appendChild(thumbnail);
                uploadArea.appendChild(text);
            }
        };
        
        reader.onerror = function() {
            console.error('Error reading file');
            alert('Error reading file. Please try again.');
        };
        
        reader.readAsDataURL(file);
    });
}

/**
 * Set up action buttons (download and copy)
 */
function setupActionButtons() {
    console.log('Setting up action buttons');
    
    // Download PNG button
    const downloadPNGButton = document.getElementById('downloadPNG');
    if (downloadPNGButton) {
        downloadPNGButton.addEventListener('click', function() {
            console.log('Download PNG button clicked');
            downloadImage('png');
        });
    }
    
    // Download JPEG button
    const downloadJPEGButton = document.getElementById('downloadJPEG');
    if (downloadJPEGButton) {
        downloadJPEGButton.addEventListener('click', function() {
            console.log('Download JPEG button clicked');
            downloadImage('jpeg');
        });
    }
    
    // Copy image button
    const copyImageButton = document.getElementById('copyImage');
    if (copyImageButton) {
        copyImageButton.addEventListener('click', function() {
            console.log('Copy image button clicked');
            copyImageToClipboard();
        });
    }
}

/**
 * Format large numbers for display (e.g., 1.5K, 2.3M)
 * @param {number} num - The number to format
 * @returns {string} Formatted number
 */
function formatLargeNumber(num) {
    if (!num) return '0';
    
    num = parseInt(num, 10);
    
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
}

/**
 * Update the tweet preview based on form values
 */
function updatePreview() {
    console.log('Updating preview');
    
    try {
        // Update name and username
        updateTextContent('namePreview', 'name');
        updateTextContent('usernamePreview', 'username');
        updateTextContent('tweetContentPreview', 'tweet');
        
        // Update statistics with formatting for large numbers
        updateStatsWithFormatting('likesPreview', 'likes');
        updateStatsWithFormatting('retweetsPreview', 'retweets');
        updateStatsWithFormatting('repliesPreview', 'replies');
        updateStatsWithFormatting('viewsPreview', 'views');
        updateStatsWithFormatting('bookmarksPreview', 'bookmarks');
        
        // Update date
        updateDatePreview();
        
        // Update time
        updateTimePreview();
        
        // Update bookmark icon and color
        updateBookmarkStatus();
        
        // Update tweet background
        updateTweetBackground();
        
        // Update verification badge
        updateVerificationBadge();
        
        console.log('Preview updated successfully');
    } catch (error) {
        console.error('Error updating preview:', error);
    }
}

/**
 * Update text content of an element based on input value
 * @param {string} previewId - ID of the preview element
 * @param {string} inputId - ID of the input element
 */
function updateTextContent(previewId, inputId) {
    const previewElement = document.getElementById(previewId);
    const inputElement = document.getElementById(inputId);
    
    if (previewElement && inputElement) {
        previewElement.textContent = inputElement.value;
    }
}

/**
 * Update statistics with proper formatting for large numbers
 * @param {string} previewId - ID of the preview element
 * @param {string} inputId - ID of the input element
 */
function updateStatsWithFormatting(previewId, inputId) {
    const previewElement = document.getElementById(previewId);
    const inputElement = document.getElementById(inputId);
    
    if (previewElement && inputElement) {
        previewElement.textContent = formatLargeNumber(inputElement.value);
    }
}

/**
 * Update the date preview
 */
function updateDatePreview() {
    const dateInput = document.getElementById('date');
    const datePreview = document.getElementById('datePreview');
    
    if (dateInput && datePreview && dateInput.value) {
        try {
            const dateValue = new Date(dateInput.value);
            const options = { month: 'short', day: 'numeric', year: 'numeric' };
            datePreview.textContent = dateValue.toLocaleDateString('en-US', options);
        } catch (error) {
            console.error('Error formatting date:', error);
        }
    }
}

/**
 * Update the time preview
 */
function updateTimePreview() {
    const timeInput = document.getElementById('time');
    const timePreview = document.getElementById('timePreview');
    
    if (timeInput && timePreview) {
        timePreview.textContent = formatTime(timeInput.value);
    }
}

/**
 * Format time from 24h to 12h with AM/PM
 * @param {string} timeString - Time in format "HH:MM"
 * @returns {string} Formatted time with AM/PM
 */
function formatTime(timeString) {
    if (!timeString) return '12:00 PM';
    
    try {
        const parts = timeString.split(':');
        let hours = parseInt(parts[0], 10);
        const minutes = parts[1];
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12; // Convert 0 to 12
        
        return hours + ':' + minutes + ' ' + ampm;
    } catch (error) {
        console.error('Error formatting time:', error);
        return '12:00 PM';
    }
}

/**
 * Update the bookmark icon and color based on checkbox
 */
function updateBookmarkStatus() {
    const bookmarkedCheckbox = document.getElementById('bookmarked');
    const bookmarkIcon = document.getElementById('bookmarkIcon');
    const bookmarksPreview = document.getElementById('bookmarksPreview');
    const bookmarkStat = bookmarksPreview ? bookmarksPreview.closest('.tweet-stat') : null;
    
    if (bookmarkedCheckbox && bookmarkIcon) {
        if (bookmarkedCheckbox.checked) {
            // Change to filled icon with blue color
            bookmarkIcon.innerHTML = '<g><path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5z"></path></g>';
            
            // Change bookmark color to blue
            if (bookmarkIcon.closest('svg')) {
                bookmarkIcon.closest('svg').style.fill = '#1d9bf0';
            }
            
            // Change bookmark count color to blue
            if (bookmarksPreview) {
                bookmarksPreview.style.color = '#1d9bf0';
            }
            
            // Change overall tweet-stat color if it exists
            if (bookmarkStat) {
                bookmarkStat.style.color = '#1d9bf0';
            }
        } else {
            // Revert to outline icon with default color
            bookmarkIcon.innerHTML = '<g><path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z"></path></g>';
            
            // Revert colors to default
            if (bookmarkIcon.closest('svg')) {
                bookmarkIcon.closest('svg').style.fill = '';
            }
            
            if (bookmarksPreview) {
                bookmarksPreview.style.color = '';
            }
            
            if (bookmarkStat) {
                bookmarkStat.style.color = '';
            }
        }
    }
}

/**
 * Update the tweet background based on select value
 */
function updateTweetBackground() {
    const backgroundSelect = document.getElementById('background');
    const tweetContainer = document.getElementById('tweetContainer');
    
    if (backgroundSelect && tweetContainer) {
        tweetContainer.className = 'tweet-container tweet-' + backgroundSelect.value;
    }
}

/**
 * Update the verification badge based on select value
 */
function updateVerificationBadge() {
    const badgeSelect = document.getElementById('badge');
    const badgePreview = document.getElementById('badgePreview');
    
    if (!badgeSelect || !badgePreview) return;
    
    const badgeType = badgeSelect.value;
    
    if (badgeType === 'none') {
        badgePreview.style.display = 'none';
        return;
    }
    
    badgePreview.style.display = 'inline';
    
    // Set the appropriate SVG based on badge type
    if (badgeType === 'blue') {
        badgePreview.innerHTML = '<svg viewBox="0 0 24 24" width="21" height="21" aria-label="Verified account" role="img"><path fill="#1DA1F2" d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"></path></svg>';
    } else if (badgeType === 'grey') {
        badgePreview.innerHTML = '<svg viewBox="0 0 22 22" width="21" height="21" aria-label="Verified account" role="img"><g><path clip-rule="evenodd" d="M12.096 1.673c-.593-.635-1.599-.635-2.192 0L8.452 3.227c-.296.316-.714.49-1.147.474L5.18 3.63c-.867-.03-1.579.682-1.55 1.55l.072 2.125c.015.433-.158.851-.474 1.147L1.673 9.904c-.635.593-.635 1.599 0 2.192l1.554 1.452c.316.296.49.714.474 1.147L3.63 16.82c-.03.867.682 1.579 1.55 1.55l2.125-.072c.433-.015.851.158 1.147.474l1.452 1.555c.593.634 1.599.634 2.192 0l1.452-1.555c.296-.316.714-.49 1.147-.474l2.126.071c.867.03 1.579-.682 1.55-1.55l-.072-2.125c-.015-.433.158-.851.474-1.147l1.555-1.452c.634-.593.634-1.599 0-2.192l-1.555-1.452c-.316-.296-.49-.714-.474-1.147l.071-2.126c.03-.867-.682-1.579-1.55-1.55l-2.125.072c-.433.015-.851-.158-1.147-.474l-1.452-1.554zM6 11.39l3.74 3.74 6.2-6.77L14.47 7l-4.8 5.23-2.26-2.26L6 11.39z" fill="#829AAB" fill-rule="evenodd"></path></g></svg>';
    } else if (badgeType === 'yellow') {
        badgePreview.innerHTML = '<svg viewBox="0 0 22 22" width="21" height="21" aria-label="Verified account" role="img"><g><path clip-rule="evenodd" d="M13.596 3.011L11 .5 8.404 3.011l-3.576-.506-.624 3.558-3.19 1.692L2.6 11l-1.586 3.245 3.19 1.692.624 3.558 3.576-.506L11 21.5l2.596-2.511 3.576.506.624-3.558 3.19-1.692L19.4 11l1.586-3.245-3.19-1.692-.624-3.558-3.576.506zM6 11.39l3.74 3.74 6.2-6.77L14.47 7l-4.8 5.23-2.26-2.26L6 11.39z" fill="url(#paint0_linear_8728_433881)" fill-rule="evenodd"></path><path clip-rule="evenodd" d="M13.348 3.772L11 1.5 8.651 3.772l-3.235-.458-.565 3.219-2.886 1.531L3.4 11l-1.435 2.936 2.886 1.531.565 3.219 3.235-.458L11 20.5l2.348-2.272 3.236.458.564-3.219 2.887-1.531L18.6 11l1.435-2.936-2.887-1.531-.564-3.219-3.236.458zM6 11.39l3.74 3.74 6.2-6.77L14.47 7l-4.8 5.23-2.26-2.26L6 11.39z" fill="url(#paint1_linear_8728_433881)" fill-rule="evenodd"></path><path clip-rule="evenodd" d="M6 11.39l3.74 3.74 6.197-6.767h.003V9.76l-6.2 6.77L6 12.79v-1.4zm0 0z" fill="#D18800" fill-rule="evenodd"></path><defs><linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_8728_433881" x1="4" x2="19.5" y1="1.5" y2="22"><stop stop-color="#F4E72A"></stop><stop offset=".539" stop-color="#CD8105"></stop><stop offset=".68" stop-color="#CB7B00"></stop><stop offset="1" stop-color="#F4EC26"></stop><stop offset="1" stop-color="#F4E72A"></stop></linearGradient><linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_8728_433881" x1="5" x2="17.5" y1="2.5" y2="19.5"><stop stop-color="#F9E87F"></stop><stop offset=".406" stop-color="#E2B719"></stop><stop offset=".989" stop-color="#E2B719"></stop></linearGradient></defs></g></svg>';
    }
}

/**
 * Download the tweet as an image
 * @param {string} format - 'png' or 'jpeg'
 */
function downloadImage(format) {
    console.log(`Starting download as ${format}`);
    
    // Check if html2canvas is available
    if (typeof html2canvas !== 'function') {
        console.error('html2canvas library not loaded');
        alert('Unable to generate image. Please ensure you have internet connectivity to load required libraries.');
        return;
    }
    
    const element = document.querySelector('.tweet-preview');
    if (!element) {
        console.error('Tweet preview element not found');
        return;
    }
    
    // Style adjustments for screenshot
    const originalBorderRadius = element.style.borderRadius;
    const originalOverflow = element.style.overflow;
    element.style.borderRadius = '0';
    element.style.overflow = 'hidden';
    
    // Show loading indicator or message
    const downloadButtons = document.querySelectorAll('.action-button');
    downloadButtons.forEach(button => {
        button.disabled = true;
        if (button.id === `download${format.toUpperCase()}`) {
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        }
    });
    
    html2canvas(element, {
        scale: 2, // Higher resolution
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
    }).then(canvas => {
        // Restore original styles
        element.style.borderRadius = originalBorderRadius;
        element.style.overflow = originalOverflow;
        
        // Create the download
        let link = document.createElement('a');
        
        if (format === 'png') {
            link.href = canvas.toDataURL('image/png');
            link.download = 'fake-tweet-repixify.png';
        } else {
            link.href = canvas.toDataURL('image/jpeg', 0.9);
            link.download = 'fake-tweet-repixify.jpeg';
        }
        
        // Restore buttons
        downloadButtons.forEach(button => {
            button.disabled = false;
            if (button.id === `download${format.toUpperCase()}`) {
                button.innerHTML = `<i class="fas fa-download"></i> Download ${format.toUpperCase()}`;
            }
        });
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('Download complete');
    }).catch(error => {
        console.error('Error generating image:', error);
        alert('An error occurred while generating the image. Please try again.');
        
        // Restore buttons
        downloadButtons.forEach(button => {
            button.disabled = false;
            if (button.id === `download${format.toUpperCase()}`) {
                button.innerHTML = `<i class="fas fa-download"></i> Download ${format.toUpperCase()}`;
            }
        });
    });
}

/**
 * Copy the tweet image to clipboard
 */
function copyImageToClipboard() {
    console.log('Starting copy to clipboard');
    
    // Check if html2canvas is available
    if (typeof html2canvas !== 'function') {
        console.error('html2canvas library not loaded');
        alert('Unable to copy image. Please ensure you have internet connectivity to load required libraries.');
        return;
    }
    
    const element = document.querySelector('.tweet-preview');
    if (!element) {
        console.error('Tweet preview element not found');
        return;
    }
    
    // Style adjustments for screenshot
    const originalBorderRadius = element.style.borderRadius;
    const originalOverflow = element.style.overflow;
    element.style.borderRadius = '0';
    element.style.overflow = 'hidden';
    
    // Show loading indicator
    const copyButton = document.getElementById('copyImage');
    if (copyButton) {
        copyButton.disabled = true;
        copyButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    }
    
    html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
    }).then(canvas => {
        // Restore original styles
        element.style.borderRadius = originalBorderRadius;
        element.style.overflow = originalOverflow;
        
        // Try to copy to clipboard
        canvas.toBlob(blob => {
            try {
                // Check if Clipboard API and ClipboardItem are supported
                if (!navigator.clipboard || !window.ClipboardItem) {
                    throw new Error('Clipboard API not supported');
                }
                
                const item = new ClipboardItem({ 'image/png': blob });
                navigator.clipboard.write([item]).then(() => {
                    console.log('Image copied to clipboard successfully');
                    alert('Image copied to clipboard!');
                }).catch(err => {
                    console.error('Could not copy image: ', err);
                    alert('Failed to copy image to clipboard. Try using the download buttons instead.');
                }).finally(() => {
                    // Restore button
                    if (copyButton) {
                        copyButton.disabled = false;
                        copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy Image';
                    }
                });
            } catch (err) {
                console.error('ClipboardItem is not supported in this browser', err);
                alert('Copying to clipboard is not supported in this browser. Try using the download buttons instead.');
                
                // Restore button
                if (copyButton) {
                    copyButton.disabled = false;
                    copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy Image';
                }
            }
        });
    }).catch(error => {
        console.error('Error generating image for clipboard:', error);
        alert('An error occurred while preparing the image. Please try again.');
        
        // Restore button
        if (copyButton) {
            copyButton.disabled = false;
            copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy Image';
        }
    });
}