let flowModule = (function () {
    let $columns = $('.column'),
        _DATA = null;
    // queryData；基于AJAX从服务器获取数据
    let queryData = function () {
        $.ajax({
            url: 'json/data.json',
            method: 'GET',
            async: false,
            success: result => {
                _DATA = result;
            }

        });
    };
    let bindHTML = function () {
        // 每次从_DATA取三条，按照三列从矮到高顺序依次插入
        for (let i = 0; i < _DATA.length; i += 3) {
            let group = _DATA.slice(i, i + 3);
            group.sort((A, B) => B.height - A.height);
            $columns.sort((A, B) => {
                let $A = $(A),
                    $B = $(B);
                return $A.outerHeight() - $B.outerHeight();
            }).each((index, column) => {
                // _DATA[i+index]计算出要往每一列中插入的数据
                // let dataItem = _DATA[i + index];
                let dataItem = group[index];
                if (!dataItem) return false;

                let {
                    id,
                    pic,
                    height,
                    title,
                    link
                } = dataItem;
                $(column).append(`<a class="item" href="${link}">
				<div class="imgBox" style='height:${height}px'>
					<img src="" alt="" data-img="${pic}">
				</div>
				<p>${id} ${title} </p>
			</a>`)
            });
        }
        setTimeout(lazyImgs, 1000);
    };
    // lazyImgs：图片延迟加载
    let lazyImgs = function () {
        let $imgBoxs = $('.container .imgBox[isLoad!="true"]'),
            $window = $(window),
            B = $window.outerHeight() + $window.scrollTop();
        // 循环每一个图片（盒子），计算其底边距离body的偏移，从而验证出是否加载真实图片
        $imgBoxs.each((index, imgBox) => {
            let $imgBox = $(imgBox),
                $img = $imgBox.children('img'),
                A = $imgBox.outerHeight() + $imgBox.offset().top;
            if (A < B) {
                $imgBox.attr('isLoad', 'true');
                $img.attr("src", $img.attr('data-img'));
                $img.on('load', () => {
                    // $img.css('display', 'block');//直接显示
                    $img.stop().fadeIn(); //基于JQ动画渐现
                });
            }
        });

    }
    // 当滚动到底端时，加载更多数据
    let loadMore = function () {
        // 滚动到底端（一屏幕高度+卷去的高度+500>=页面真实高度），加载更多
        let $window = $(window),
            winH = $window.outerHeight(),
            scrollT = $window.scrollTop,
            pageH = $(document).height();
        if (winH + scrollT + 500 >= pageH) {
            queryData();
            bindHTML();
        }
    };

    return {
        init: function () {
            queryData();
            bindHTML();
            window.onscroll = function () {
                // 延迟加载
                lazyImgs();


            }
        }
    }
})();
flowModule.init();