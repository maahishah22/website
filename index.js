window.onscroll = function() {
    var dropdown = document.getElementById("dropdownMenu");

    // Show dropdown when scroll is beyond 100px
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        dropdown.style.top = "0";  // Slide down into view
    } else {
        dropdown.style.top = "-100px";  // Slide back up and hide
    }
};