features = document.getElementById("nav_features");
about = document.getElementById("nav_about");
back_to_top = document.getElementsByClassName("back_to_top");

// When features is clicked
features.addEventListener("click", function () {
    scrollToSmoothly(750, 800);
});
// When about is clicked
about.addEventListener("click", function () {
    scrollToSmoothly(4000, 1500);
});
// When the arrow up at the bottom of page is clicked
back_to_top[0].addEventListener("click", function () {
    scrollToSmoothly(0, 0);
});

// Function to scroll smoothly
function scrollToSmoothly(pos, time) {
    var currentPos = window.pageXOffset;
    var start = null;
    if(time == null) time = 500;
    pos = +pos, time = +time;
    window.requestAnimationFrame(function step(currentTime) {
        start = !start ? currentTime : start;
        var progress = currentTime - start;
        if (currentPos < pos) {
            window.scrollTo(0, ((pos - currentPos) * progress / time) + currentPos);
        } else {
            window.scrollTo(0, currentPos - ((currentPos - pos) * progress / time));
        }
        if (progress < time) {
            window.requestAnimationFrame(step);
        } else {
            window.scrollTo(0, pos);
        }
    });
}