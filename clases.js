const inst = {
  random(a, b) {
    return Math.floor(a + Math.random() * (b + 1 - a));
  },
  getDirection(file) {
    return `./images/` + file + `.png`;
  },
  containerSort(mass, element) {
    mass.forEach(function (elem, ind) {
      $(`.` + element).append(
        $(`<div class="beet">
			<p>${ind + 1}</p>
				<p class="over">${elem}</p>
			</div>`)
      );
    });
    $(`.` + element)
      .children()
      .on(`click`, function () {
        const text_ = $(this).find(`.over`).text();
        var fast_ = fast_.bind(system);

        function fast_(ind) {
          this.commandMass[ind][2]();
        }
        if (element == `system__sounds-container`) {
          $(this)
            .parent()
            .parent()
            .find(`.play`)
            .attr(`src`, `./sounds/${text_}.wav`);
          fast_(0);
          $(`.system__cont-audio`).css({
            display: "flex"
          });
          system.audio.render();
        } else {
          $(`.black`).show();
          $(`video`).attr(`src`, `./videous/${text_}.mp4`);
          fast_(1);
          $(`.system__vid-attr`).css({
            display: "flex"
          });
          system.video.render();
        }
      });
  },
  functionsFromObject(obj) {
    Object.entries(obj).forEach(function (elem) {
      if (typeof elem[1] == `function`) obj[elem[0]]();
    });
  },
  resetBigElem(obj, elem) {
    elem.removeAttr(`style`).hide();
    obj.move.activeMove = false;
    elem.find(`[move]`).attr(`active`, false).removeAttr(`style`);
  },
  convertTime(elem) {
    return JSON.stringify(elem).length == 1 ? `0${elem}` : elem;
  },
  roundTime(val) {
    val = Math.floor(val);
    var sec = val,
      min = 0;
    while (sec >= 60) {
      sec -= 60;
      min++;
    }
    return `${this.convertTime(min)} : ${this.convertTime(sec)}`;
  }
};
class Media {
  constructor(elem) {
    this.elem = $(elem);
    this.type = this.elem.find(`video`).length != 0 ? `video` : `audio`;
    this.type = document.querySelector(elem + ` ` + this.type);
    this.elem.currentTime = 0;
    this.input_ = this.elem.find(`[input]`);
    this.play = this.elem.find(`[type="pause"]`);
    this.clickPlay = () => {
      const act_ = JSON.parse(this.play.attr(`active`));
      if (act_) {
        this.play.attr(`src`, inst.getDirection(`pause`));
        this.type.play();
      } else {
        this.play.attr(`src`, inst.getDirection(`play`));
        this.type.pause();
      }
      this.play.attr(`active`, !act_);
    };
    this.play.on(`click`, this.clickPlay);
    this.input_.on(`change`, () => {
      this.type.currentTime = (this.input_.val() / 100) * this.type.duration;
      this.elem
        .find(`.current-time`)
        .text(inst.roundTime(this.type.currentTime));
    });
    this.input_.on(`focusin`, () => {
      this.focus = true;
    });
    $(window).on(`mouseup`, (event) => {
      if (event.which == 1 && this.focus && $(event.target).attr(`input`)) {
        this.focus = false;
        this.input_.blur();
      }
    });
    this.changeTime = (event) => {
      var time;
      if (event.attr(`type`) == `rotate-left`) time = this.type.currentTime - 5;
      else time = this.type.currentTime + 5;
      if (time < 0) time = 0;
      else if (time > this.type.duration) time = this.type.duration;
      this.type.currentTime = time;
    };
    this.elem.find(`.rotate`).on(`click`, (event) => {
      this.changeTime($(event.target));
    });
    this.elem.find(`.system__progress-bar`).on(`mouseenter`, function () {
      $(this).hide();
    });
    this.elem.find(`.system__progress`).on(`mouseleave`, () => {
      this.elem.find(`.system__progress-bar`).show();
    });
    $(window).on(`resize`, () => {
      this.setBarLength();
    });
  }
  focus = false;
  render() {
    this.elem
      .find(`[type="pause"]`)
      .attr(`src`, inst.getDirection(`pause`))
      .attr(`active`, false);
    this.type.addEventListener(`timeupdate`, () => {
      this.elem
        .find(`.current-time`)
        .text(inst.roundTime(this.type.currentTime));
      if (!this.focus)
        this.input_.val((this.type.currentTime / this.type.duration) * 100);
      this.setBarLength();
    });
    this.type.addEventListener(`loadedmetadata`, () => {
      this.elem.find(`.all-time`).text(inst.roundTime(this.type.duration));
    });
    this.elem.find(`.current-time`).text(`00:00`);
  }
  setBarLength() {
    this.value =
      this.elem.find(`.system__progress`).width() *
      (this.type.currentTime / this.type.duration);
    this.elem
      .find(`.system__progress-bar`)
      .css({
        width: this.value
      });
  }
}
class Audio extends Media {
  constructor(elem) {
    super(elem);
    this.type.volume = 0.5;
    $(`#audio-regulation`).on(`change`, () => {
      this.type.volume = +$(`#audio-regulation`).val() / 100;
    });
  }
}
class Video extends Media {
  constructor(elem) {
    super(elem);
    $(window).on(`keyup`, (key) => {
      if (key.which == 37)
        this.changeTime(this.elem.find(`[type="rotate-left"]`));
      else if (key.which == 39)
        this.changeTime(this.elem.find(`[type="rotate-right"]`));
      else if (key.which == 32) this.clickPlay();
    });
  }
}
class Move {
  constructor(elem) {
    this.elem = elem;
    this.focus = false;
    this.activeMove = false;
    $(window).on(`mousemove`, (event) => {
      if (event.which == 1 && this.activeMove) this.focus = true;
      else this.focus = false;
      if (this.focus) {
        var top = event.clientY,
          left = event.clientX;
        const hei_ = this.elem.height(),
          wid_ = this.elem.width();
        if (top < 0) top = 0;
        else if (top + hei_ > $(window).height())
          top = $(window).height() - hei_;
        if (left + wid_ > $(window).width()) left = $(window).width() - wid_;
        this.elem.css({
          top: top,
          left: left,
        });
      }
    });
    $(window).on(`resize`, () => {
      if (this.elem.attr(`active`) == `false`) return;
      console.log(`resized`);
      this.elem.css({
        top: `auto`,
        left: `auto`
      })
    })
    this.move = this.elem.find(`[move]`);
    this.move.on(`click`, () => {
      const cur_ = JSON.parse(this.move.attr(`active`));
      if (cur_) {
        this.elem.css({
          cursor: "default"
        });
        this.move.removeAttr(`style`);
      } else {
        this.elem.css({
          cursor: "move"
        });
        this.move.css({
          background: `#F43F52`
        });
      }
      this.activeMove = !cur_;
      this.move.attr(`active`, !cur_);
    });
  }
}
class ConvertColumns {
  active = false;
  mass = [];
  onArrow = 0;
  static focus = false;
  constructor(elem, amount) {
    this.elem = $(`.`+elem);
    this.binded=elem;
    this.events();
    this.amount = amount;
    for (let i = 0; i < amount; i++) {
      this.mass.push(inst.convertTime(i));
    }
  }
  events() {
    this.elem.on(`mousedown`, (event) => {
      ConvertColumns.focus=this.binded;
      this.active = this.recentlyPress = true;
      this.startY = event.clientY;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.recentlyPress = false;
      }, 500);
    })
    $(window).on(`mouseup`, (event) => {
        const target=$(event.target);
        if (!this.active || this.recentlyPress || this.binded!=ConvertColumns.focus) return;
        this.active = false;
        if (target.is(`input`) || target.is(`.circle`)) return;
        this.grabWidth = event.clientY - this.startY;
        if (this.grabWidth < -250) this.grabWidth = -250;
        else if (this.grabWidth > 250) this.grabWidth = 250;
        this.power = Math.round(this.grabWidth / 21, 0);
        this.animate()
    })
    this.elem.children().on(`click`, (event) => {
      this.target_ = $(event.target).attr(`type`);
      if (this.target_ == `up`) {
        this.onArrow--;
        this.onArrow = this.massFit(this.onArrow);
        this.changeNumbers(this.onArrow);
      } else if (this.target_ == `down`) {
        this.onArrow++;
        this.onArrow = this.massFit(this.onArrow);
        this.changeNumbers(this.onArrow);
      }
    })
  }
  animate() {
    this.animeTime = Math.abs(2000 / this.power);
    this.onArrowMass = [];
    if (this.power > 0) {
      for (let i = 1; i <= this.power; i++) {
        this.onArrow++;
        this.onArrow = this.massFit(this.onArrow)
        this.onArrowMass.push(this.onArrow)
      }
    } else {
      for (let i = 0; i <= -this.power; i++) {
        this.onArrow--;
        this.onArrow = this.massFit(this.onArrow)
        this.onArrowMass.push(this.onArrow)
      }
    }
    this.onArrowMass.forEach((elem, ind) => {
      setTimeout(() => {
        this.changeNumbers(elem)
      }, this.animeTime * (ind + 1) + 100);
    })
  }
  massFit(elem) {
    if (elem > this.amount - 1) elem = 0;
    else if (elem < 0) elem = this.amount - 1;
    return elem;
  }
  changeNumbers(arr) {
    this.fast_ = (val, elem) => {
      elem.text(inst.convertTime(this.massFit(val)))
    }
    this.fast_ = this.fast_.bind(this);
    for (var elem of this.elem.children()) {
      elem = $(elem);
      if (elem.attr(`ind`) == 1) {
        this.fast_(arr - 1, elem);
      } else if (elem.attr(`ind`) == 2) {
        this.fast_(arr, elem)
      } else {
        this.fast_(arr + 1, elem)
      }
    }
  }
}