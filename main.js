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
        if (type == `video`) {
          $(`.system__vid-attr`).hide();
          $(`.black`).hide();
        } else if (type == `audio`) $(`.system__cont-audio`).hide();
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
        inst.resetBigElem(calculator, $(`.calculator`));
      },
    ],
    [
      `game`,
      () => {
        $(`.game`).css({ display: "flex" }).attr(`active`, true);
        game.innit();
      },
      () => {
        inst.resetBigElem(game, $(`.game`));
      },
    ],
    [
      `time`,
      () => {
        $(`.time`).css({ display: "flex" }).attr(`active`, true);
      },
      () => {
        inst.resetBigElem(timeManagement, $(`.time`));
      },
    ],
  ],
  video: new Video(`.system__video-big`),
  audio: new Audio(`.system__sounds`),
  alertWindow:{
    start(message,signal) {
      $(`.alert`).css({display:"flex"});
      $(`.alert__message`).text(message);
      $(`.alert__main`).addClass(`animate-alert`);
      setTimeout(()=>{
        $(`.alert__main`).removeClass(`animate-alert`);
      },500);
      if (signal) $(`.alert__audio`).attr(`src`,`./sounds/alert.wav`);
    },
    events() {
      function end_() {
        $(`.alert`).hide()
        $(`.alert__audio`).attr(`src`,`#`);
      }
        $(`.alert__close`).on(`click`,end_)
        $(`.alert`).on(`click`,function (event) {
          if ($(event.target).is(`.alert`)) {
            end_()
          }
        })
    }
  }
};
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
      selectionStart,
      focusIn = false;
    function keys(event, areaVal) {
      const keyCodes = [
        [53, `%`, event.shiftKey],
        [54, `^`, event.shiftKey],
        [57, `(`, event.shiftKey],
        [48, `)`, event.shiftKey],
        [107, `+`],
        [109, `-`],
        [111, `/`],
        [106, `*`],
        [190, `.`],
        ...fast,
        [69, `e`],
        [80, `Pi`],
        [76, `log{}{}`],
        [83, `{}&#8730;{}`],
        [187, goToCompile, event.altKey], //=
        [72, moveHistory, event.altKey], //h
        [82, clear, event.altKey], //r
      ];
      keyCodes.forEach(function (elem) {
        if (elem.length == 2) elem.push(true);
      });
      for (let i = 0; i < keyCodes.length; i++) {
        if (event.which == keyCodes[i][0] && keyCodes[i][2]) {
          if (typeof keyCodes[i][1] == `function`) keyCodes[i][1]();
          else insertKey(keyCodes[i][1], areaVal.split(``));
          break;
        }
      }
    }
    function moveHistory() {
      if (!history.length) {
        if (area.val().length == 1) area.val(``);
        return;
      }
      if (!changeHistory) history.pop();
      if (!history.length) area.val(``);
      else {
        area.val(history.pop());
        changeHistory = true;
      }
    }
    function insertKey(val, text) {
      changeHistoryFunc(text.join(``) + val);
      if (placeInArea) {
        text.splice(selectionStart, 0, val);
        selectionStart += val.length;
        area.val(text.join(``));
      } else area.val(text.join(``) + val);
      changeHistory = false;
    }
    function clear() {
      area.val(``);
      changeHistoryFunc(``);
      changeHistory = false;
    }
    function changeHistoryFunc(value) {
      if (history.length > 200) history.shift();
      history.push(value);
    }
    function goToCompile() {
      calculator.compile();
      clear();
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
      else if (val == `go`) goToCompile();
      else insertKey(val, text);
    });
    area.on(`keyup`, function (key) {
      if (key.which == 13 && key.ctrlKey) {
        goToCompile();
        $(this).blur();
        return;
      }
      changeHistoryFunc($(this).val());
      changeHistory = false;
    });
    area.on(`focusout`, function () {
      focusIn = false;
      const prop_ = area.prop(`selectionStart`);
      if (prop_ != area.val().length) {
        placeInArea = true;
        selectionStart = prop_;
      } else placeInArea = false;
    });
    area.on(`focusin`, function () {
      focusIn = true;
    });
    $(window).on(`keyup`, (event) => {
      if (
        focusIn ||
        event.which == 18 ||
        event.which == 16 ||
        $(`.calculator`).attr(`active`) == `false`
      )
        return;
      keys(event, area.val());
    });
  },
  move: new Move($(`.calculator`)),
  compile() {
    const mass = $(`.calculator__input`)
      .val()
      .split(``)
      .filter(function (elem) {
        if (elem != `` || elem != `/n`) return elem;
      });
    var count = [],
      error = false,
      actionMass = [];
    function errorLog() {
      $(`.calculator__result`).text(`error`);
    }
    const process = {
      separateBySign() {
        var from = 0;
        function isTrigger(sign, searchForDugs = false) {
          var value = false;
          var triggers = [`+`, `-`, `*`, `/`, `%`, `^`, `)`, `(`, `{`, `}`];
          if (searchForDugs) {
            for (let i = 0; i < 4; i++) {
              triggers.pop();
            }
          }
          for (let i = 0; i < triggers.length; i++) {
            if (triggers[i] == sign) {
              value = true;
              break;
            }
          }
          return value;
        }
        function dugs() {
          var value = false;
          if (
            mass.indexOf(`(`) != -1 &&
            (find(`(`) != find(`)`) || find(`{`) != find(`}`))
          ) {
            value = true;
          }
          function find(char) {
            var number = 0;
            mass.forEach(function (elem) {
              if (elem == char) number++;
            });
            return number;
          }
          return value;
        }
        for (let i = 0; i < mass.length; i++) {
          if (isTrigger(mass[i])) {
            var num = mass.slice(from, i);
            function fast_() {
              return (
                mass[i] != `(` &&
                mass[i] != `)` &&
                mass[i] != `{` &&
                mass[i] != `}`
              );
            }
            if (
              (isTrigger(mass[i + 1], true) && fast_()) ||
              (i == mass.length - 1 && isTrigger(mass[i], true))
            )
              error = true;
            if (num.length != 0) count.push(num.join(``), mass[i]);
            else if (num.length == 0 && isTrigger(mass[i])) count.push(mass[i]);
            from = i + 1;
          }
          const fast_ = mass.slice(from, i + 1);
          if (i == mass.length - 1 && fast_ != ``) count.push(fast_.join(``));
        }
        if (count.length == 0 || dugs()) error = true;
      },
      separateByActions() {
        const alphabet = [
          "a",
          "b",
          "c",
          "d",
          "e",
          "f",
          "g",
          "h",
          "i",
          "j",
          "k",
          "l",
          "m",
          "n",
          "o",
          "p",
          "q",
          "r",
          "s",
          "t",
          "u",
          "v",
          "w",
          "x",
          "y",
          "z",
        ];
        function getCode() {
          var codeMass = [];
          for (let i = 0; i < 14; i++) {
            var char;
            if (inst.random(1, 2) == 1) {
              char = [...alphabet].sort(function () {
                return 0.5 - Math.random();
              })[0];
            } else {
              char = inst.random(0, 9);
            }
            codeMass.push(char);
          }
          return codeMass.join(``);
        }
        for (let i = 0; i < count.length; i++) {
          if (count[i] == `(`) {
            getEndDug(i + 1);
            i = 0;
          }
        }
        function getEndDug(startIndex) {
          recurs(startIndex);
          function recurs(i, num = 0) {
            var mass = count.slice(i, count.length);
            for (let ind = 0; ind < mass.length; ind++) {
              elem = mass[ind];
              if (elem == `)`) {
                const val_ = count.slice(i, i + ind),
                code_ = getCode();
                actionMass.push({
                  num: num,
                  val: val_,
                  code: code_,
                });
                count.splice(i - 1, val_.length + 2, `:${code_}:`);
                return i;
              } else if (elem == `(`)
              i=recurs(i + ind + 1, ++num);
            }
          }
          //1+(2+(3+4)+(5+6))
        }
      },
    };
    process.separateBySign();
    process.separateByActions();
    console.log(actionMass);
    console.log(count);
  },
};
const game = {
  innit() {
    var massElem = [
      $(`.game__process`),
      $(`.game__final-result`),
      $(`.game__opponent`).find(`[alt="typical"]`),
      $(`.my-hand`),
    ].forEach(function (elem) {
      elem.hide();
    });
    $(`.game__main-select`).show();
    $(`#wins`).text(0);
    $(`#defaults`).text(0);
    var clickSelected = false,
      roundsNum,
      noOneWins = false,
      currentRound = 0;
    const mass = ["rock", "paper", "scissors"];
    const tactics = [
      [
        ["rock", "rock", "rock"],
        ["paper", "paper", "paper"],
        ["scissors", "scissors", "scissors"],
      ],
      ["paper", "scissors", "rock"],
      ["rock", "scissors", "paper"],
      [
        ["rock", "paper", "paper"],
        ["scissors", "paper", "paper"],
        ["paper", "scissors", "paper"],
      ],
    ];
    tactics.forEach(function (elem) {
      if (typeof elem[0] == `object`)
        elem.sort(function () {
          return 0.5 - Math.random();
        });
      else elem.push(...elem, ...elem);
    });
    class Player {
      counts = 0;
      select = ``;
      prevWin = "static";
      prevSelect = ``;
    }
    class Opponent extends Player {
      tactic = inst.random(0, 1);
      index = inst.random(0, 3);
      howToPlay = [...tactics[this.index]].flat();
    }
    const me = new Player();
    const opponent = new Opponent();
    function setRounds() {
      $(`.game__round p`).text(currentRound + `/` + roundsNum);
    }
    function animation() {
      function bothAnim(amount) {
        const fast_ = $(`.game__you`).find(`[alt="typical"]`);
        $(fast_[0]).animate({ left: amount }, 1000);
        $(fast_[2]).animate({ right: amount }, 1000);
      }
      bothAnim($(`.game__pick`).width() / 2 - $(`[alt="typical"]`).width() / 2);
      setTimeout(() => {
        $(`[alt="typical"]`).css({ visibility: "hidden" });
        $(`.my-hand`).show().addClass(`move-up`);
        $(`.opponent-hand`).addClass(`move-down`);
        setWidth();
      }, 1000);
      setTimeout(() => {
        if ($(`.game`).attr(`active`) == `false`) return;
        $(`.my-hand`).hide().removeClass(`move-up`);
        $(`.opponent-hand`).hide().removeClass(`move-down`);
        $(`.game__you`)
          .find(`[type="${me.select}"]`)
          .css({ visibility: "visible" });
        $(`.game__opponent`).find(`[type="${opponent.select}"]`).show();
        $(`#wins`).text(me.counts);
        $(`#defaults`).text(opponent.counts);
        setRounds();
        setTimeout(() => {
          bothAnim(0);
          $(`.game__you`).find(`[type]`).css({ visibility: "visible" });
          $(`.game__opponent`).find(`[type]`).hide();
          $(`.opponent-hand`).show();
          setTimeout(() => {
            if (me.counts == roundsNum || opponent.counts == roundsNum) {
              var final_ = $(`.game__final-result`);
              final_.removeClass([`victoryFon`, `defeat`]);
              final_.addClass(`appear`).css({ display: "flex" });
              if (me.counts > opponent.counts) {
                final_.find(`p`).text(`you won`);
                final_.addClass(`victoryFon`);
              } else {
                final_.find(`p`).text(`you lost`);
                final_.addClass(`defeat`);
              }
            }
          }, 500);
        }, 500);
      }, 4000);
    }
    function result() {
      //!!select opponent
      if (opponent.tactic == 0) {
        if (!noOneWins) {
          var elem_ = opponent.howToPlay.shift();
          if (!elem_) {
            opponent.howToPlay.push(...tactics[opponent.index]);
            elem_ = opponent.howToPlay.shift();
          }
          opponent.select = elem_;
        }
      } else {
        if (opponent.prevWin != `static` && opponent.prevWin)
          opponent.select = opponent.prevSelect;
        else if (opponent.prevWin == `static`)
          opponent.select = mass[inst.random(0, 2)];
        else {
          mass.forEach(function (elem) {
            if (me.prevSelect != elem && opponent.prevSelect != elem)
              opponent.select = elem;
          });
        }
      }
      currentRound++;
      //!!who won
      me.prevSelect = me.select;
      opponent.prevSelect = opponent.select;
      if (me.select == opponent.select) {
        opponent.prevWin = `static`;
        noOneWins = true;
      } else {
        if (
          (me.select == "scissors" && opponent.select == "paper") ||
          (me.select == "paper" && opponent.select == "rock") ||
          (me.select == "rock" && opponent.select == "scissors")
        ) {
          me.counts++;
          opponent.prevWin = false;
        } else {
          opponent.counts++;
          opponent.prevWin = true;
        }
        noOneWins = false;
      }
    }

    var events = [
      [
        $(`.click`),
        function () {
          if (clickSelected) return;
          clickSelected = true;
          setTimeout(() => {
            clickSelected = false;
            $(this).removeAttr(`style`);
            $(`.game__process`).fadeIn(500).css({ display: "flex" });
            $(`.game__sounds`).attr(`src`, `./sounds/gameStarts.mp3`);
            setRounds();
          }, 1500);
          setTimeout(() => {
            $(`.game__main-select`).fadeOut(500);
          }, 1000);
          $(this).css({ background: `#F43F52` });
          roundsNum = +$(this).find(`p`).attr(`value`);
        },
      ],
      [
        $(`.game__you`).find(`[alt]`),
        function () {
          if (clickSelected) return;
          clickSelected = true;
          setTimeout(() => {
            clickSelected = false;
          }, 5000);
          me.select = $(this).attr(`type`);
          result();
          animation();
        },
      ],
      [$(`.game__repeat`), game.innit],
    ].forEach(function (elem) {
      elem[0].off(`click`);
      elem[0].on(`click`, elem[1]);
    });
    function setWidth() {
      $(`.my-hand`).css({
        left: $(`.game__pick`).width() / 2 - $(`.my-hand`).width() / 2,
      });
    }
    $(window).off(`resize`);
    $(window).on(`resize`, setWidth);
  },
  move: new Move($(`.game`)),
};
const timeManagement = {
  move: new Move($(`.time`)),
  events() {
    $(`.time__circle`).on(`click`, function () {
      if ($(this).hasClass(`selected-ball`)) return;
      $(`.time__circle`).removeClass(`selected-ball`);
      $(this).addClass(`selected-ball`);
      $(`[time-el]`).fadeOut(300);
      setTimeout(() => {
        const type=$(this).attr(`type`);
        $(`.time__` + type)
          .fadeIn(300)
          .css({ display: "flex" });
          if (type==`timer`) $(`.time__main`).css({height:$(`.time__main`).width()})
      }, 300);
    });
  },
  stopWatch: {
    timer : {
      allowTimer: false,
      atFirst: true,
      milliSeconds:0,
      seconds:0,
      minutes:0,
      hours:0,
      numOfLoops:0,
      process() {
        function fast(val,num,next) {
          if (this[val]==num) {
            this[val]=0;
            this[next]++;
          }
        }
        fast=fast.bind(this);
        timer_=timeManagement.stopWatch.timer;
        this.interval = setInterval(() => {
          if (!this.allowTimer) return;
          this.milliSeconds++;
          fast(`milliSeconds`,100,`seconds`);
          fast(`seconds`,60,`minutes`);
          fast(`minutes`,60,`hours`);
          if (hours==24) this.clear();
          this.insert();
        },10);
      },
      clear() {
        this.milliSeconds=this.seconds=this.minutes=this.hours=0;
        this.atFirst = true;
        this.allowTimer=false;
        this.numOfLoops=0;
        clearInterval(this.interval);
        $($(`.time__manage div`)[0]).find(`img`).attr(`src`, inst.getDirection(`play2`));
        $(`.time__box`).empty()
        this.insert()
      },
      insert(){
        var mass=[
          [this.milliSeconds,`milliSeconds`],
          [this.seconds,`seconds`],
          [this.minutes,`minutes`],
          [this.hours,`hours`]
        ].forEach(function (elem) {
          $(`.time__`+elem[1]).text(inst.convertTime(elem[0]))
        })
      },
      getDifference() {
        var data=[];
        var mass=[`hours`,`minutes`,`seconds`,`milliSeconds`].forEach(function (elem) {
          data.push([]);
          $(`.`+elem).each(function () {
            data[data.length-1].push(+$(this).text())
          });
          var taker_=data[data.length-1];
          if (taker_.length) {
            var reduced=taker_.reduce(function (a,b) {
              return a+b;
            })
            data[data.length-1]=reduced;
          }
        })
        var hours=(data[0]) ? this.hours-data[0] : this.hours;
        var minutes=(data[1]) ? this.minutes-data[1] : this.minutes;
        var seconds=(data[2]) ? this.seconds-data[2] : this.seconds;
        var milliSeconds=(data[3]) ? this.milliSeconds-data[3] : this.milliSeconds;
        while (milliSeconds<0) {
          milliSeconds=100+milliSeconds;
          seconds--;
        }
        while (seconds<0) {
          seconds=60+seconds;
          minutes--;
        }
        while (minutes<0) {
          minutes=60+minutes;
          hours--;
        }
        var result=[];
        var mass=[hours,minutes,seconds,milliSeconds].forEach(function (elem) {
          result.push(inst.convertTime(elem))
        })
        return result;
      },
    },
    events() {
      $(`.time__manage div`).on(`click`, (event)=> {
        var target=$(event.target);
        const type_ = target.is(`img`) || target.is(`p`) || target.is(`.box`) ? target.parent().attr(`type`) : target.attr(`type`), timer=this.timer;
        var img = $($(`.time__manage div`)[0]).find(`img`);
        if (type_ == `loop` && timer.allowTimer) {
          var diff=timer.getDifference();
          var str = `<div class="center">
          <div class="time__fool center">
            <div class="time__loop-status beet">
              <div class="bigSize">${++timer.numOfLoops}</div>
              <div class="beet">
                <p>${inst.convertTime(timer.hours)}</p>
                <p>:</p>
                <p>${inst.convertTime(timer.minutes)}</p>
                <p>:</p>
                <p>${inst.convertTime(timer.seconds)}</p>
                <p>:</p>
                <p>${inst.convertTime(timer.milliSeconds)}</p>
              </div>
              <div class="beet time__diff">
                <p>+</p>
                <p class="hours" get>${diff[0]}</p>
                <p>:</p>
                <p class="minutes" get>${diff[1]}</p>
                <p>:</p>
                <p class="seconds" get>${diff[2]}</p>
                <p>:</p>
                <p class="milliSeconds" get>${diff[3]}</p>
              </div>
            </div>
          </div>
        </div>`;
        $(`.time__box`).append(str);
        } else if (type_ == `play-pause`) {
          timer.allowTimer = !timer.allowTimer;
          timer.allowTimer
            ? img.attr(`src`, inst.getDirection(`pause2`))
            : img.attr(`src`, inst.getDirection(`play2`));
          if (timer.atFirst) {
            timer.atFirst = false;
            timer.process();
          }
        } else if (type_==`end`) timer.clear()
      });
    },
  },
  alarmClock:{
    canvas:document.querySelector(`canvas`),
    alert:system.alertWindow.start,
    events() {
      function setCircleSize() {
        $(`.time__main`).css({height:$(`.time__main`).width()})
      }
        setCircleSize()
      $(window).on(`resize`,setCircleSize)
      $(`.seePicture`).on(`mouseenter`,function () {
        $(`.time__grid`).css({display:"grid"})
      })
      $(`.time__select-img`).on(`mouseleave`,function () {
        $(`.time__grid`).hide()
      })
      const img_=$(`.seePicture`).find(`img`);
      $(`.time__grid-cont div`).on(`click`,function () {
        $(this).siblings().removeAttr(`style`);
        $(this).css({background:`#E74C3C`})
        img_.attr(`src`,$(this).find(`img`).attr(`src`));
        $(`.time__grid`).hide()
      })
      $(`.timer-go`).on(`click`,()=> {
        var hours=+$(`.select-hours`).val() || 0, minutes=+$(`.select-minutes`).val() || 0, seconds=+$(`.select-seconds`).val() || 0;
        if ((!hours && !minutes && !seconds) || img_.attr(`src`)==`./images/picture.png` || $(`.timer-go`).attr(`active`)==`true`) {
          this.alert("the main data is not set")
          return;
        }
        $(`.timer-go`).attr(`active`,true);
        var value=seconds+minutes*60+hours*3600;
        if (value>21600 || value<10) {
          this.alert("value is unsuitable")
          return;
        }
        while (seconds>=60) {
          minutes++;
          seconds-=60;
        }
        while (minutes>=60) {
          hours++;
          minutes-=60;
        }
        this.start(seconds,minutes,hours,value)
      })
      $(`.time__closeTimer`).on(`click`,()=>{
        this.stop()
      })
    },
    start(sec,min,hour,val) {
      const canvas=this.canvas;
      const ctx=canvas.getContext("2d") , globalVal=val , str=`${inst.convertTime(hour)}:${inst.convertTime(min)}:${inst.convertTime(sec)}`;
      canvas.width=canvas.height=150;
      $(`.time__input`).val(``);
      $(`.time__put-image`).find(`img`).attr(`src`,$(`.seePicture`).find(`img`).attr(`src`));
      $(`.time__put-image`).css({display:"flex"})
      this.interval=setInterval(()=>{
        val--;
        if (val==0) {
          this.alert(`your time is over , you had ${str}`,true)
          this.stop();
          return;
        }
        sec--;
        if (sec<0) {
          sec=59;
          min--;
        }
        if (min<0) {
          min=59;
          hour--;
        }
        var shower=2*val/globalVal;
        var color;
        if (shower>=1.4) color="#2E86C1"
        else if (shower<1.4 && shower>=0.7) color="#A569BD"
        else color="#E74C3C"
        $(`.hours2`).text(inst.convertTime(hour));
        $(`.minutes2`).text(inst.convertTime(min))
        $(`.seconds2`).text(inst.convertTime(sec));
        ctx.beginPath();
        ctx.clearRect(0,0,canvas.width,canvas.width)
        var fill_=canvas.width/2;
        ctx.arc(fill_,fill_,fill_,0,shower*Math.PI);
        ctx.fillStyle=color;
        ctx.fill()
        ctx.stroke();
      },1000);
    },
    stop() {
      clearInterval(this.interval);
      $(`.timer-go`).attr(`active`,false);
      $(`.time__put-image`).hide()
      $(`.seconds2`).text(`00`);
      this.canvas.width=this.canvas.width;
    }
  },
  timer:{
    events() {

    }
  }
};
//start
inst.functionsFromObject(system);
calculator.innit();
timeManagement.events();
[`stopWatch`,`alarmClock`,`timer`].forEach(function (elem) {
  timeManagement[elem].events();
})
system.alertWindow.events()
