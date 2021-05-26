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
          $(`.system__cont-audio`).css({ display: "flex" });
          system.audio.render();
        } else {
          $(`video`).attr(`src`, `./videous/${text_}.mp4`);
          fast_(1);
          $(`.system__vid-attr`).css({ display: "flex" });
          system.video.render();
        }
      });
  },
  convertTime(time) {
    time = Math.floor(time);
    if (time < 10) return `00:0` + time;
    else if (time >= 10 && time < 60) return `00:` + time;
    else {
      var taker = 0;
      const full = Math.round(time % 60);
      while (time >= 60) {
        time = time / 60;
        taker++;
      }
      return `0${taker}:${full < 10 ? `0` + full : full}`;
    }
  },
};
class Media {
  constructor(elem) {
    this.type = document.querySelector(
      elem.find(`video`).length != 0 ? `video` : `audio`
    );
    this.elem = elem;
    this.focus = false;
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
        .text(inst.convertTime(this.type.currentTime));
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
    //unique
    if (this.elem.find(`[autoplay]`).attr(`attr`) == `audio`) {
      this.type.volume = 0.5;
      $(`#audio-regulation`).on(`change`, () => {
        this.type.volume = +$(`#audio-regulation`).val() / 100;
      });
    } else {
      $(window).on(`keyup`, (key) => {
        if (key.which == 37)
          this.changeTime(this.elem.find(`[type="rotate-left"]`));
        else if (key.which == 39)
          this.changeTime(this.elem.find(`[type="rotate-right"]`));
        else if (key.which == 32) this.clickPlay();
      });
    }
  }
  render() {
    this.elem
      .find(`[type="pause"]`)
      .attr(`src`, inst.getDirection(`pause`))
      .attr(`active`, false);
    this.type.addEventListener(`timeupdate`, () => {
      this.elem
        .find(`.current-time`)
        .text(inst.convertTime(this.type.currentTime));
      if (!this.focus)
        this.input_.val((this.type.currentTime / this.type.duration) * 100);
    });
    this.type.addEventListener(`loadedmetadata`, () => {
      this.elem.find(`.all-time`).text(inst.convertTime(this.type.duration));
    });
    this.elem.find(`.current-time`).text(`00:00`);
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
        this.elem.css({
          top: event.clientY,
          left: event.clientX,
        });
      }
    });
    this.elem.find(`[move]`).on(`click`, () => {
      const cur_ = JSON.parse(this.elem.find(`[move]`).attr(`active`));
      if (cur_) this.elem.css({ cursor: "default" });
      else this.elem.css({ cursor: "move" });
      this.activeMove = !cur_;
      this.elem.find(`[move]`).attr(`active`, !cur_);
    });
  }
}
const system = {
  time() {
    var quoteCount = 29;
    const quoteMass = [
      `"Spread love everywhere you go. Let no one ever come to you without leaving happier." -Mother Teresa`,
      `"Do not go where the path may lead, go instead where there is no path and leave a trail." -Ralph Waldo Emerson`,
      `"Whoever is happy will make others happy too." -Anne Frank`,
      `"It is during our darkest moments that we must focus to see the light." -Aristotle`,
      `"The best and most beautiful things in the world cannot be seen or even touched , they must be felt with the heart." -Helen Keller`,
      `"Tell me and I forget. Teach me and I remember. Involve me and I learn." -Benjamin Franklin`,
      `"The future belongs to those who believe in the beauty of their dreams." -Eleanor Roosevelt`,
      `"Don't judge each day by the harvest you reap but by the seeds that you plant." -Robert Louis Stevenson`,
      `"Always remember that you are absolutely unique. Just like everyone else." -Margaret Mead`,
      `"When you reach the end of your rope, tie a knot in it and hang on." -Franklin D. Roosevelt`,
    ];
    setInterval(() => {
      const date = new Date();
      const hours = date.getHours();
      var type_;
      if (hours >= 7 && hours < 13) type_ = 1;
      else if (hours >= 13 && hours < 17) type_ = 2;
      else if (hours >= 17 && hours < 22) type_ = 3;
      else type_ = 4;
      $(`.system`).css({ backgroundImage: `url(./images/sea${type_}.jpg)` });
      $(`.system__day-show`).attr(`src`, inst.getDirection(`sun${type_}`));
      var data = [
        [`seconds`, date.getSeconds()],
        [`minutes`, date.getMinutes()],
        [`hours`, date.getHours()],
        [`mounths`, date.getMonth()],
        [`years`, date.getFullYear()],
        [`days`, date.getDay()],
        [`daysOfWeek`, Date().split(` `)[0]],
      ].forEach(function (elem) {
        $(`#` + elem[0]).text(elem[1] < 10 ? `0` + elem[1] : elem[1]);
      });
      quoteCount++;
      if (quoteCount == 30) {
        quoteCount = 0;
        var result = quoteMass[inst.random(0, 9)].split(`-`);
        result[1] = `-<span>${result[1]}</span>`;
        $(`.system__quote`)
          .empty()
          .append($(`<p>${result.join(``)}</p>`));
      }
    }, 1000);
  },
  events() {
    //command
    const restoreMass = [];
    $(`.command`).each(function (ind) {
      $(this).attr(`active`, false).attr(`index`, ind);
      restoreMass.push($(this).find(`img`).attr(`src`));
    });
    $(`.command`).on(`mouseenter`, function () {
      $(this).find(`img`).addClass(`hover-inst`);
    });
    $(`.command`).on(`mouseleave`, function () {
      $(this).find(`img`).removeClass(`hover-inst`);
    });
    $(`.command`).on(`click`, function () {
      var act = JSON.parse($(this).attr(`active`)),
        type = $(this).attr(`type`);
      var sort2_ = sort2_.bind(system);
      if (!act) {
        $(this).find(`img`).attr(`src`, `./images/cross.png`);
        sort2_(1);
      } else {
        $(this)
          .find(`img`)
          .attr(`src`, restoreMass[+$(this).attr(`index`)]);
        sort2_(2);
        $(type).attr(`src`, `#`);
        if (type == `video`) $(`.system__vid-attr`).hide();
        else if (type == `audio`) $(`.system__cont-audio`).hide();
      }
      function sort2_(num) {
        this.commandMass.forEach(function (elem) {
          if (elem[0] == type) elem[num]();
        });
      }
      $(this).attr(`active`, !act);
    });
    //command
    $(`[type="range"]`).attr(`min`, 0).attr(`max`, 100);
  },
  sounds() {
    inst.containerSort(
      [
        `cold-winds`,
        `farm-animals`,
        `night-forest`,
        `ambience`,
        `light-rain`,
        `morning-note`,
        `river-shore`,
        `scary-woods`,
        `sea-waves`,
        `waves-birds`,
      ],
      `system__sounds-container`,
      `sounds`
    );
  },
  videos() {
    inst.containerSort(
      [
        `big-waves`,
        `cloudy-sea`,
        `cutter`,
        `dirty-beach`,
        `river`,
        `sweet-waves`,
        `water-couple`,
        `waterfall`,
        `water-rocks`,
        `wild-river`,
      ],
      `system__videous-container`,
      `videous`
    );
  },
  commandMass: [
    [
      `audio`,
      () => {
        $(`.system__sounds-container`).css({ display: "flex" });
      },
      () => {
        $(`.system__sounds-container`).hide();
      },
    ],
    [
      `video`,
      () => {
        $(`.system__videous-container`).css({ display: "flex" });
      },
      () => {
        $(`.system__videous-container`).hide();
      },
    ],
    [
      `calculator`,
      () => {
        $(`.calculator`).show().attr(`active`, true);
      },
      () => {
        $(`.calculator`).removeAttr(`style`).hide();
        calculator.move.activeMove = false;
        $(`.calculator__move`).attr(`active`, false);
      },
    ],
  ],
  video: new Media($(`.system__video-big`)),
  audio: new Media($(`.system__sounds`)),
};
Object.entries(system).forEach(function (elem) {
  if (typeof elem[1] == `function`) system[elem[0]]();
});
const calculator = {
  innit() {
    var history = [``],
      changeHistory = false;
    const area = $(`.calculator__input`);
    var fast = [];
    for (let i = 0; i < 10; i++) {
      fast.push([48 + i, i]);
    }
    var placeInArea = false,
      selectionStart , focusIn=false;
    function keys(event,areaVal) {
      const keyCodes = [
        [53, `%`, event.shiftKey],
				[54, `^`, event.shiftKey],
				[57,`(`,event.shiftKey],
				[48,`)`,event.shiftKey],
				[107, `+`],
        [109, `-`],
        [111, `/`],
        [106, `*`],
        [190, `.`],
				...fast,
        [69, `e`],
        [80, `Pi`],
        [76, `log()()`],
        [83, `()&#8730;()`],
        [187, calculator.compile(), event.altKey], //=
        [72, moveHistory(), event.altKey], //h
				[82, clear(), event.altKey] //r
      ];
      keyCodes.forEach(function (elem) {
        if (elem.length == 2) elem.push(true);
      });
      for (let i = 0; i < keyCodes.length; i++) {
        if (event.which == keyCodes[i][0] && keyCodes[i][2]) {
          if (typeof keyCodes[i][1] == `function`) keyCodes[i][1]();
					else insertKey(keyCodes[i][1],areaVal.split(``));
					break
				}
      }
    }
    function moveHistory() {
      if (!history.length) return;
      if (!changeHistory) history.pop();
      if (!history.length) area.val(``);
      else {
        area.val(history.pop());
        changeHistory = true;
      }
		}
		function insertKey(val,text) {
			changeHistory2(text.join(``) + val);
        if (placeInArea) {
          text.splice(selectionStart, 0, val);
          selectionStart += val.length;
          area.val(text.join(``));
        } else area.val(text.join(``) + val);
        changeHistory = false;
		}
    function clear() {
      area.val(``);
      changeHistory2(``);
      changeHistory = false;
    }
    function changeHistory2(value) {
      if (history.length > 200) history.shift();
      history.push(value);
    }
    $(`.calculator__control`)
      .children()
      .each(function () {
        if (!$(this).attr(`value`)) $(this).attr(`value`, $(this).text());
      });
    //$(`.calculator`).hide();
    $(`.calculator__control div`).on(`click`, function () {
      const val = $(this).attr(`value`);
      var text = area.val().split(``);
      if (val == `clear`) clear();
      else if (val == "history") moveHistory();
      else insertKey(val,text);
    });
    area.on(`keyup`, function () {
      changeHistory2($(this).val());
    });
    area.on(`focusout`, function () {
			focusIn=false;
      const prop_ = area.prop(`selectionStart`);
      if (prop_ != area.val().length) {
        placeInArea = true;
        selectionStart = prop_;
      } else placeInArea = false;
		});
		area.on(`focusin`,function () {
			focusIn=true;
		})
    $(window).on(`keyup`, (event) => {
			//	if ($(`.calculator`).attr(`active`)==`false`) return;
			if (focusIn) return;
      keys(event,area.val());
    });
  },
  move: new Move($(`.calculator`)),
  compile() {},
};
calculator.innit();
