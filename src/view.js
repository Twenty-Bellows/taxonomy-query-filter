window.addEventListener('load', function() {
    const savedScrollPosition = sessionStorage.getItem('queryFilterScrollPosition');
    if (savedScrollPosition !== null) {
        window.scrollTo(0, parseInt(savedScrollPosition, 10));
        sessionStorage.removeItem('queryFilterScrollPosition');
    }
});
