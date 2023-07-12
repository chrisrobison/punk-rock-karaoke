(function() {
    app.sticky = {
        state: {
            headers: []
        },
        ui: {
            offsetY: 66,
            headers: [],
            parents: []
        },
        init: function() {
            app.sticky.load($$(".sticky"));
            document.addEventListener("scroll", app.sticky.scroll);
        },

        load: function(headers) {
            if (typeof headers === "object" && headers.length > 0) {
                app.sticky.ui.headers = headers;
                headers.forEach((el, i) => {
                    let wrap = el.parentNode;
                    wrap.dataset.defaultTop = el.offsetTop;
                    wrap.dataset.defaultHeight = el.offsetHeight;
                    wrap.dataset.defaultLeft = el.offsetLeft;
                    wrap.style.height = el.offsetHeight + 'px';
                    app.sticky.ui.parents.push(wrap);
                });

            }
        },

        scroll: function() {

            app.sticky.ui.parents.forEach(function(el, i) {

                let wrap = el;
                wrap.style.height = wrap.dataset.defaultHeight;
                let $headerPosition = wrap.dataset.defaultTop;

                if ($headerPosition <= window.scrollY) {
                    var next = app.sticky.ui.parents[i + 1];
                    let nextPosition = next.dataset.defaultTop - app.sticky.ui.offsetY;
                    app.sticky.ui.headers[i].classList.add("fixed");
                    app.sticky.ui.headers[i].style.left = wrap.dataset.defaultLeft + 'px';

                    if (next && nextPosition >= window.scrollY) {
                        wrap.classList.add("absolute");
                        wrap.style.top = nextPosition + 'px';
                        wrap.style.left = wrap.dataset.defaultLeft + 'px';
                    }

                } else {

                    var prev = app.sticky.ui.parents[i - 1];

                    app.sticky.ui.headers[i].classList.remove("fixed");
                    app.sticky.ui.headers[i].style.left = '0px';

                    if (prev && window.scrollY <= wrap.dataset.defaultTop - wrap.dataset.defaultHeight) {

                        prev.classList.remove("absolute");
                    }
                }
            });
        }
    };

})();

