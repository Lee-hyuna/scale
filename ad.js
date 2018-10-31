

  (function ( $, $spe ) {

    var speCollFlipsnap = {
      flipsnap: null,
      $flipsnap: $spe.find('.flipsnap'),
      startIdx: (function () {
        var startIdx = ${startIdx};
        return startIdx;
      })(),
      query: (function () {
        var query = null;
        try {
          query = decodeURIComponent(utf8Query);
          query = query.replace(/\+/g, ' ');
        } catch ( err ) {
          query = null;
        }

        return query;
      })(),

      init: function () {
        var _this = this;

        _this.setFlipsnap();
        _this.evtTab();
        _this.evtWindow();
        _this.lazyLoad();
        _this.setMoreFold();
        _this.callSendKaKaoTalk();

      }
    };

    speCollFlipsnap.setFlipsnap = function () {
      var _this = speCollFlipsnap;
      var $flipsnapItemList = _this.$flipsnap.find('.flipsnap_item');

      /* 플리킹 생성 */
      _this.flipsnap = Flipsnap('#${collectionId} .flipsnap');

      /* 플리킹 이벤트 */
      _this.flipsnap.element.addEventListener('fspointmove', function () {

        $spe.find('.flipsnap_item').removeClass('_active').eq(_this.flipsnap.currentPoint).addClass('_active');

        _this.redrawPanel();

        /* 탭 */
        _this.setTab();
        _this.lazyLoad();

        if ( _this.startIdx != _this.flipsnap.currentPoint ) {
          _this.query = null;
          _this.startIdx = null;
        }

        _this.callSendKaKaoTalk();
      }, false);

      /* 첫 페이지 설정 */
      if ( _this.startIdx > 0 ) {
        _this.flipsnap.moveToPoint(_this.startIdx);
      }
      ;
      $spe.find('.flipsnap_view .flipsnap_item').eq(_this.flipsnap.currentPoint).addClass('_active');
      _this.redrawPanel();
      _this.setTab();
    };

    /* 패널 높이 재설정 */
    speCollFlipsnap.setHeight = function () {
      var _this = speCollFlipsnap,
        $curElem = $spe.find('._active .flipsnap_wrap'),
        _height = $curElem.outerHeight();

      _this.$flipsnap.height(_height);
    };

    /* 패널 높이 등 다시그리기 */
    speCollFlipsnap.redrawPanel = function () {
      var _this = speCollFlipsnap;
      _this.moreFoldDelete();
      _this.setHeight();
      _this.flipsnap.refresh();
    };

    /* 탭 이벤트 */
    speCollFlipsnap.evtTab = function () {
      var _this = speCollFlipsnap,
        $elTabLink = $spe.find('.spe_tab a'),
        $elSubTabLink = $spe.find('.spe_subtab a');

      $elTabLink.on('click', function ( e ) {
        e.preventDefault();
        var curIdx = $(this).parent('li').attr('data-panel') ? parseInt($(this).parent('li').attr('data-panel'), 10) : $elSubTabLink.index(this);
        _this.flipsnap.moveToPoint(curIdx);
      });


      $elSubTabLink.on('click', function ( e ) {
        e.preventDefault();
        var curIdx = $(this).parent('li').attr('data-panel') ? parseInt($(this).parent('li').attr('data-panel'), 10) : $elSubTabLink.index(this);
        _this.flipsnap.moveToPoint(curIdx);
      });

    };

    speCollFlipsnap.lazyLoad = function () {
      var flip = $spe.find('.flipsnap'),
        items = $spe.find('.flipsnap_item'),
        idx = $(flip).find('._active').index(),
        curImgs = $(items[ idx ]).find('li:not(.hide) img._lazy'),
        prevImgs = $(items[ idx - 1 ]).find('li:not(.hide) img._lazy'),
        nextImgs = $(items[ idx + 1 ]).find('li:not(.hide) img._lazy'),
        imgs = $.merge($.merge($.merge([], curImgs), prevImgs), nextImgs);

      for ( var i = 0; i < imgs.length; i++ ) {
        var currentSrc = imgs[ i ].getAttribute('data-src');
        imgs[ i ].setAttribute('src', currentSrc);
      }
    };

    /* 탭 선택 */
    speCollFlipsnap.setTab = function () {
      var _this = speCollFlipsnap,
        idx1 = parseInt($spe.find('._active').attr('data-tab1'), 10),
        idx2 = parseInt($spe.find('._active').attr('data-tab2'), 10),
        $curTab = $spe.find('.spe_tab li').eq(idx1),
        $curTabWrap = $spe.find('.spe_tab .list_spetab'),
        $curSubTabWrap = $spe.find('.grid_xscroll').eq(idx1 == 4 ? 0 : 1),
        $curSubTabChildren = $curSubTabWrap.children().eq(idx2);

      $curTab.addClass('on').siblings().removeClass('on');

      /* scroll-x 이동 */
      var halfW = ($curTab.innerWidth()) / 2,
        parentHalfW = ($curTabWrap.innerWidth()) / 2,
        posX = $curTab[ 0 ].offsetLeft,
        moveX = posX - parentHalfW + halfW;
      $curTabWrap.scrollLeft(moveX);


      /* 서브탭 */
      $spe.find('.spe_subtab .list_subtab').addClass('hide').filter('[data-tab1="' + idx1 + '"]').removeClass('hide');
      var $curSubTab = $spe.find('.spe_subtab .list_subtab:not(.hide)');
      if ( !isNaN(idx2) ) {
        $curSubTab.find('li').removeClass('on').eq(idx2).addClass('on');
      }
      ;
    };

    speCollFlipsnap.moreFoldDelete = function () {
      var $cnt = parseInt($spe.find('._active .extender').attr('data-fold-cnt'), 10),
        $curItem = $spe.find('._active li').length,
        $curItem2 = $spe.find('._active tr').length;

      if ( $cnt >= $curItem && $cnt >= $curItem2 ) {
        $spe.find('._active .extend_comp').addClass('hide');
      }
      ;
    };

    speCollFlipsnap.setMoreFold = function () {
      /* 더보기 */
      var _this = speCollFlipsnap;

      $spe.find('.extender').on('click', function ( e ) {
        e.preventDefault();

        $(this).toggleClass('fold');

        if ( $(this).hasClass('fold') ) {
          $spe.find('._active .list_movie li').removeClass('hide');
          $spe.find('._active .list_ancestor li').removeClass('hide');
          $spe.find('._active .tbl_comp tr').removeClass('hide');
        } else {
          var cnt = parseInt($(this).attr('data-fold-cnt'), 10),
            $item = $spe.find('._active ul:not(.list_card) li'),
            $item2 = $spe.find('._active .tbl_comp tr');

          $('html, body').animate({ 'scrollTop': $('#speColl').offset().top });
          $item.each(function ( key, item ) {
            if ( key >= cnt ) {
              $(item).addClass('hide');
            }
            ;
          })
          $item2.each(function ( key, item ) {
            if ( key >= cnt ) {
              $(item).addClass('hide');
            }
            ;
          })
        }
        ;
        _this.redrawPanel();
        _this.lazyLoad();
      });
    };

    /* 윈도우 이벤트 - resize, load */
    speCollFlipsnap.evtWindow = function () {
      var _this = speCollFlipsnap,
        $window = $(window);

      $window.on('load', function () {
        _this.redrawPanel();
      });
      $window.on('resize', function () {
        _this.redrawPanel();
      });
    };

    speCollFlipsnap.init();


  })(jq, jq('#${collectionId}'));
