    const $timeButtons = document.querySelectorAll('[data-type]');
    const $timer = document.querySelector('#pomodoro-timer');
    const $start = document.querySelector('#pomodoro-start');
    const $stop = document.querySelector('#pomodoro-stop');
    const $reset = document.querySelector('#pomodoro-reset');
    const $resetIcon = document.querySelector('#resetIcon');
    const $setting = document.querySelector('#pomodoro-setting')
    const $settingsModal = document.querySelector('#settingsModal');
    const $btnClose = document.querySelector('#btn-close');
    const $settPomodoro = document.querySelector('#settPomodoro');
    const $btnSave = document.querySelector('.btn-save');
    const $settShort = document.querySelector('#settShort');
    const $settLong = document.querySelector('#settLong');
    const $btnCloseText = document.querySelector('#settingsCloseBtn2')
    const $btnResetAll = document.querySelector('.btn-reset');
    const $alarmSound = document.querySelector('#alarmSound');

    const DEFAULTS = {
      pomodoro: 25,
      short: 5,
      long: 10
    };

    $btnResetAll.addEventListener('click', () => {
      // 1) input 값 초기화
      $settPomodoro.value = DEFAULTS.pomodoro;
      $settShort.value = DEFAULTS.short;
      $settLong.value = DEFAULTS.long;

      // 2) DURATIONS도 초기화
      DURATIONS.pomodoro = DEFAULTS.pomodoro * 60;
      DURATIONS.short = DEFAULTS.short * 60;
      DURATIONS.long = DEFAULTS.long * 60;

      // 3) 현재 모드의 타이머도 초기화
      clearInterval(timerId);
      timerId = null;
      remaining = DURATIONS[currentMode];

      // 4) 화면 숫자 다시 출력
      render();
    });


    
    $setting.addEventListener('click', () => {
      $settingsModal.classList.add('show'); 
    });

    document.querySelectorAll('.btnClose').forEach(btn => {
      btn.addEventListener('click', () => {
        $settingsModal.classList.remove('show');
      });
    });

    $btnSave.addEventListener('click', () => {
  // 1) 인풋에서 값 읽기 (숫자로 변환)
      const p = Number($settPomodoro.value.trim());
      const s = Number($settShort.value.trim());
      const l = Number($settLong.value.trim());

      // 2) 유효하지 않은 값이면 기본값으로
      const pomodoroMinutes = isNaN(p) || p <= 0 ? 25 : p;
      const shortMinutes    = isNaN(s) || s <= 0 ? 5  : s;
      const longMinutes     = isNaN(l) || l <= 0 ? 10 : l;

      // 3) DURATIONS 갱신
      DURATIONS.pomodoro = pomodoroMinutes * 60;
      DURATIONS.short    = shortMinutes * 60;
      DURATIONS.long     = longMinutes * 60;

      // 4) 현재 모드에 맞춰 남은 시간도 다시 세팅
      clearInterval(timerId);
      timerId = null;
      remaining = DURATIONS[currentMode];
      render();

      $settingsModal.classList.remove('show');
    })
    
    let DURATIONS = {
      pomodoro: 25 * 60,
      short: 1 * 60,
      long: 10 * 60,
    }

    let currentMode = 'pomodoro';
    let remaining = DURATIONS.pomodoro;
    let timerId = null;
    let toggle = false;

    function render() {
      const m = Math.floor(remaining / 60);
      const s = remaining % 60;
      const mm = String(m).padStart(2, '0');  //앞에 2자리보다 짧으면 0 채우기 (예: 5 → "05")
      const ss = String(s).padStart(2, '0');
      $timer.textContent = `${mm}:${ss}`;
    }

  // 모드 버튼(pomodoro / short / long) 클릭 시
    $timeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;       // "pomodoro" / "short" / "long"
        currentMode = type;
        remaining = DURATIONS[type];         // 남은 시간 세팅
        clearInterval(timerId);              // 타이머 멈추고
        timerId = null;
        render();                         // 화면 다시 그리기
        // resetTime(currentMode);
      });
    });

    // 1초마다 실행되는 함수
    function tick() {
      if (remaining <= 0) {
        clearInterval(timerId);
        timerId = null;
        remaining = 0;
        render();

        $alarmSound.currentTime = 0; // 항상 처음부터 재생되게
        $alarmSound.play();

        return;
      } // else 
      remaining--;
      render();
    }

    // start 버튼 클릭 시
    function startTime () {
      if(timerId === null){
        timerId = setInterval(tick, 1000);
      }
      
    } 

    function stopTime () {
      if(timerId !== null) {
        clearInterval(timerId); // 스탑
        timerId = null;
      }
      stopAlarm();
    }

    function resetTime () {
      remaining = DURATIONS[currentMode];
      clearInterval(timerId);
      timerId = null;
      stopAlarm()
      render();
    }

    $start.addEventListener('click', startTime);
    $stop.addEventListener('click', stopTime);
    $reset.addEventListener('click', () => {
      resetTime();

    if (toggle) {
      $resetIcon.classList.remove('spin2');
      $resetIcon.classList.add('spin1');
    } else {
      $resetIcon.classList.remove('spin1');
      $resetIcon.classList.add('spin2');
    }

    toggle = !toggle;
    });

    function stopAlarm() {
      $alarmSound.pause();
      $alarmSound.currentTime = 0;
    }


    render();