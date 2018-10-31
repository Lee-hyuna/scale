(function(exports, doc) {
  var photoUpload = {
    canvas: document.getElementById("canvas"),
    ctx: this.canvas.getContext("2d"),
    img: null,
    EDS: new exports.M.EventDrivenStructure(self.state),
    state: {
      src: "images/dog.png",
      x: 0,
      y: 0,
      width: 0,
      height: 0
    },
    drag: false,
    init: function() {
      var self = this;
      console.log('Photo Upload Testing...');
      self.setCanvas();
      self.EDS.renderedBy("update")(
        self.reDrawCanvas,
        self.dataURLChange
      );
    }
  };
  
  photoUpload.setCanvas = function() {
    var self = photoUpload;
    self.img = new Image();
    self.img.src = self.state.src;

    self.img.addEventListener("load", function() {
      self.ctx.drawImage(this, 0, 0);
      self.bindEvent();
    }, false);
  };
  
  photoUpload.reDrawCanvas = function() {
    var self = photoUpload;
    self.clearCanvas();
    self.drawScreen();
    // self.drawSelRect();
  };

  photoUpload.dataURLChange = function() {
    var self = photoUpload;
    // self.state.src = self.canvas.toDataURL();
    // history.undoList.push(self.state.src)
  }

  photoUpload.drawScreen = function() {
    var self = photoUpload;
    self.ctx.drawImage(self.img, 0, 0, self.EDS.state.width, self.EDS.state.height);
  };

  photoUpload.bindEvent = function() {
    var self = photoUpload;
    self.btnEvent();
    self.canvas.addEventListener('mousedown', self.evtMouseDown)
    self.canvas.addEventListener('mouseup', self.evtMouseUp)
  };
  
  photoUpload.clearCanvas = function() {
    var self = photoUpload;
    self.ctx.clearRect(0, 0, self.img.width, self.img.height);
  };
  
  photoUpload.btnEvent = function() {
    var self = photoUpload;
    doc.querySelectorAll(".btn").forEach(item => {
      if (item.classList.contains("btn_origin")) { item.setAttribute("data-resize", self.img.width) }
  
      item.addEventListener("click", e => {
        self.EDS.setState('update', {
          width: Number(e.target.getAttribute("data-resize")),
          height: Number(
            e.target.getAttribute("data-resize") * (self.img.height / self.img.width)
          )
        })
      });
    });

    doc.querySelector('.undo').addEventListener('click', function() {
      console.log('undo');
      // self.EDS.setState('update', {
      //   src: restore_state
      // });
    });

    doc.querySelector('.redo').addEventListener('click', function() {
      console.log('redo');
    });
  };  

  photoUpload.evtMouseMove = function (e) {
    e.preventDefault();
    var self = photoUpload
    if(self.drag) {
      self.state.x = e.pageX - self.canvas.offsetLeft;
      self.state.y = e.pageY - self.canvas.offsetTop;
      self.EDS.setState('update', {
        width: self.state.x,
        height: self.state.y
      });
    }
  }

  photoUpload.evtMouseUp = function () {
    var self = photoUpload;
    self.drag = false;
    self.canvas.removeEventListener('mousemove', self.evtMouseMove)
  }
  
  photoUpload.evtMouseDown = function (e) {
    e.preventDefault();
    var self = photoUpload;
    self.drag = true;
    self.state.x = e.pageX - self.canvas.offsetLeft;
    self.state.y = e.pageY - self.canvas.offsetTop;
    self.canvas.addEventListener('mousemove', self.evtMouseMove)
  }

  photoUpload.init();
})( window, document )