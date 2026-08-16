/* Frontend Interview Prep — question runner.
   Answers persist in localStorage; Evaluate copies a graded-by-LLM payload. */

(function () {
  'use strict';

  var QUESTIONS = window.QUESTIONS || [];
  var STORAGE_KEY = 'interview-prep-answers-v1';
  var LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

  var AREA_LABELS = {
    react: 'React',
    javascript: 'JavaScript',
    html: 'HTML',
    css: 'CSS',
  };

  var TYPE_LABELS = {
    mcq: 'choose',
    debug: 'find the bug',
    write: 'write code',
  };

  var answers = load();
  var activeArea = 'all';

  /* ---------- storage ---------- */

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (err) {
      return {};
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch (err) {
      /* private mode / quota — answers just won't survive a reload */
    }
  }

  function isAnswered(n) {
    var a = answers[n];
    if (a === undefined || a === null) return false;
    if (Array.isArray(a)) return a.length > 0;
    return String(a).trim().length > 0;
  }

  /* ---------- tiny syntax highlighter ----------
     Single pass with one alternation per language. Every match is consumed and
     escaped exactly once, so emitted markup is never re-scanned — a second pass
     would happily highlight the word "class" inside a <span class="..."> it had
     just written. */

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  var JS_KEYWORDS =
    'await|async|break|case|catch|class|const|continue|default|delete|do|else|export|extends|finally|for|from|function|if|import|in|instanceof|let|new|of|return|static|super|switch|this|throw|try|typeof|var|void|while|yield|null|undefined|true|false';

  var GRAMMARS = {
    js: {
      re: new RegExp(
        [
          '(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)', // 1 comment
          '(`(?:\\\\.|[^`\\\\])*`|"(?:\\\\.|[^"\\\\\\n])*"|\'(?:\\\\.|[^\'\\\\\\n])*\')', // 2 string
          '(<\\/?[a-zA-Z][\\w.-]*)', // 3 jsx tag
          '\\b(' + JS_KEYWORDS + ')\\b', // 4 keyword
          '\\b(\\d+(?:\\.\\d+)?)\\b', // 5 number
          '\\b([a-zA-Z_$][\\w$]*)(?=\\()', // 6 call
        ].join('|'),
        'g',
      ),
      classes: [null, 'tok-com', 'tok-str', 'tok-tag', 'tok-key', 'tok-num', 'tok-fn'],
    },
    html: {
      re: /(<!--[\s\S]*?-->)|(<\/?[a-zA-Z][\w-]*)|("[^"]*"|'[^']*')|\s([a-zA-Z-]+)(?==)/g,
      classes: [null, 'tok-com', 'tok-tag', 'tok-str', 'tok-key'],
    },
    css: {
      re: /(\/\*[\s\S]*?\*\/)|("[^"]*"|'[^']*')|(@[a-z-]+)|([a-z-]+)(?=\s*:)|\b(-?\d*\.?\d+(?:px|rem|em|%|vh|vw|fr|s|ms|deg)?)\b/g,
      classes: [null, 'tok-com', 'tok-str', 'tok-tag', 'tok-key', 'tok-num'],
    },
  };

  function highlight(code, lang) {
    var grammar = GRAMMARS[lang === 'html' ? 'html' : lang === 'css' ? 'css' : 'js'];
    var re = new RegExp(grammar.re.source, 'g');
    var out = '';
    var last = 0;
    var match;

    while ((match = re.exec(code)) !== null) {
      /* zero-length match would spin forever */
      if (match[0] === '') {
        re.lastIndex += 1;
        continue;
      }

      var groupIndex = 0;
      for (var g = 1; g < grammar.classes.length; g += 1) {
        if (match[g] !== undefined) {
          groupIndex = g;
          break;
        }
      }

      var start = match.index + match[0].indexOf(match[groupIndex]);
      out += escapeHtml(code.slice(last, start));
      out += '<span class="' + grammar.classes[groupIndex] + '">' + escapeHtml(match[groupIndex]) + '</span>';
      last = start + match[groupIndex].length;
    }

    return out + escapeHtml(code.slice(last));
  }

  /* ---------- rendering ---------- */

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function renderCard(q, index) {
    var num = index + 1;
    var card = el('article', 'card');
    card.id = 'q' + num;
    card.dataset.area = q.area;
    card.dataset.num = String(num);

    var head = el('div', 'card-head');
    head.appendChild(el('span', 'q-num', String(num).padStart(3, '0')));

    var areaBadge = el('span', 'badge badge-area', AREA_LABELS[q.area] || q.area);
    areaBadge.dataset.area = q.area;
    head.appendChild(areaBadge);
    head.appendChild(el('span', 'badge badge-type', TYPE_LABELS[q.type] || q.type));
    head.appendChild(el('span', 'topic', q.topic));
    card.appendChild(head);

    card.appendChild(el('p', 'prompt', q.prompt));

    if (q.code) {
      var pre = el('pre', 'code');
      var code = el('code');
      code.innerHTML = highlight(q.code, q.language || 'js');
      pre.appendChild(code);
      card.appendChild(pre);
    }

    card.appendChild(q.type === 'mcq' ? renderOptions(q, num) : renderTextarea(q, num));

    if (isAnswered(num)) card.classList.add('is-answered');
    return card;
  }

  function renderOptions(q, num) {
    var wrap = el('div', 'options');
    var inputType = q.multi ? 'checkbox' : 'radio';
    var saved = answers[num];
    var selected = Array.isArray(saved) ? saved : saved !== undefined ? [saved] : [];

    q.options.forEach(function (optText, i) {
      var label = el('label', 'option');
      var input = document.createElement('input');
      input.type = inputType;
      input.name = 'q' + num;
      input.value = String(i);
      if (selected.indexOf(String(i)) !== -1 || selected.indexOf(i) !== -1) {
        input.checked = true;
        label.classList.add('is-selected');
      }

      input.addEventListener('change', function () {
        if (q.multi) {
          var checked = [];
          wrap.querySelectorAll('input:checked').forEach(function (node) {
            checked.push(node.value);
          });
          answers[num] = checked;
        } else {
          answers[num] = input.value;
        }
        wrap.querySelectorAll('.option').forEach(function (node) {
          node.classList.toggle('is-selected', node.querySelector('input').checked);
        });
        save();
        refreshState();
      });

      label.appendChild(input);
      label.appendChild(el('span', 'option-label', LETTERS[i] + '.'));
      label.appendChild(el('span', 'option-text', optText));
      wrap.appendChild(label);
    });

    return wrap;
  }

  function renderTextarea(q, num) {
    var ta = el('textarea', 'answer');
    ta.placeholder =
      q.type === 'write' ? 'Write your code here…' : 'Explain what is wrong, why it happens, and how you would fix it…';
    ta.value = answers[num] || '';
    ta.spellcheck = false;

    ta.addEventListener('input', function () {
      answers[num] = ta.value;
      save();
      refreshState();
    });

    /* Tab inserts two spaces instead of leaving the field — this is a code box. */
    ta.addEventListener('keydown', function (event) {
      if (event.key !== 'Tab' || event.shiftKey) return;
      event.preventDefault();
      var start = ta.selectionStart;
      var end = ta.selectionEnd;
      ta.value = ta.value.slice(0, start) + '  ' + ta.value.slice(end);
      ta.selectionStart = ta.selectionEnd = start + 2;
      answers[num] = ta.value;
      save();
      refreshState();
    });

    return ta;
  }

  function render() {
    var container = document.getElementById('questions');
    container.textContent = '';

    var order = ['react', 'javascript', 'html', 'css'];
    var seen = {};

    QUESTIONS.forEach(function (q, i) {
      if (!seen[q.area]) {
        seen[q.area] = [];
      }
      seen[q.area].push({ q: q, i: i });
    });

    order.forEach(function (area) {
      var group = seen[area];
      if (!group || !group.length) return;

      var header = el('div', 'area-header');
      header.dataset.area = area;
      header.appendChild(el('h2', null, AREA_LABELS[area] || area));
      header.appendChild(el('span', 'area-sub', group.length + ' questions'));
      container.appendChild(header);

      group.forEach(function (entry) {
        container.appendChild(renderCard(entry.q, entry.i));
      });
    });

    renderJumpGrid();
    refreshState();
  }

  function renderJumpGrid() {
    var grid = document.getElementById('jump-grid');
    grid.textContent = '';

    QUESTIONS.forEach(function (q, i) {
      var num = i + 1;
      var cell = el('button', 'jump-cell', String(num));
      cell.type = 'button';
      cell.dataset.num = String(num);
      cell.dataset.area = q.area;
      cell.title = AREA_LABELS[q.area] + ' — ' + q.topic;
      cell.addEventListener('click', function () {
        var target = document.getElementById('q' + num);
        if (target) target.scrollIntoView({ block: 'start' });
      });
      grid.appendChild(cell);
    });
  }

  /* ---------- state sync ---------- */

  function refreshState() {
    var answered = 0;

    QUESTIONS.forEach(function (q, i) {
      var num = i + 1;
      var done = isAnswered(num);
      if (done) answered += 1;

      var card = document.getElementById('q' + num);
      if (card) card.classList.toggle('is-answered', done);

      var cell = document.querySelector('.jump-cell[data-num="' + num + '"]');
      if (cell) {
        cell.classList.toggle('is-answered', done);
        cell.classList.toggle('is-hidden', activeArea !== 'all' && q.area !== activeArea);
      }
    });

    document.getElementById('progress-count').textContent = String(answered);
    document.querySelector('.progress-total').textContent = '/' + QUESTIONS.length + ' answered';
    document.getElementById('progress-bar').style.width =
      (QUESTIONS.length ? (answered / QUESTIONS.length) * 100 : 0) + '%';

    var counts = { all: 0, react: 0, javascript: 0, html: 0, css: 0 };
    QUESTIONS.forEach(function (q, i) {
      if (!isAnswered(i + 1)) return;
      counts.all += 1;
      if (counts[q.area] !== undefined) counts[q.area] += 1;
    });
    Object.keys(counts).forEach(function (key) {
      var node = document.getElementById('count-' + key);
      if (node) node.textContent = String(counts[key]);
    });
  }

  function applyFilter(area) {
    activeArea = area;

    document.querySelectorAll('.chip').forEach(function (chip) {
      chip.classList.toggle('is-active', chip.dataset.area === area);
    });

    document.querySelectorAll('.card').forEach(function (card) {
      card.hidden = area !== 'all' && card.dataset.area !== area;
    });

    document.querySelectorAll('.area-header').forEach(function (header) {
      header.hidden = area !== 'all' && header.dataset.area !== area;
    });

    refreshState();
  }

  /* ---------- evaluate ---------- */

  function answerText(q, num) {
    var saved = answers[num];

    if (q.type === 'mcq') {
      var picked = Array.isArray(saved) ? saved : saved !== undefined ? [saved] : [];
      if (!picked.length) return '(no answer)';
      return picked
        .map(function (idx) {
          var i = Number(idx);
          return LETTERS[i] + '. ' + q.options[i];
        })
        .join('\n');
    }

    return saved && String(saved).trim() ? String(saved).trim() : '(no answer)';
  }

  function buildPayload() {
    var lines = [];

    QUESTIONS.forEach(function (q, i) {
      var num = i + 1;
      lines.push('### Question ' + num + ' [' + (AREA_LABELS[q.area] || q.area) + ' — ' + q.topic + ']');
      lines.push(q.prompt);

      if (q.code) {
        lines.push('```' + (q.language || ''));
        lines.push(q.code);
        lines.push('```');
      }

      if (q.type === 'mcq') {
        lines.push('Options:');
        q.options.forEach(function (opt, idx) {
          lines.push(LETTERS[idx] + '. ' + opt);
        });
        if (q.multi) lines.push('(more than one option is correct)');
      }

      lines.push('');
      lines.push('CANDIDATE ANSWER:');
      lines.push(answerText(q, num));
      lines.push('');
    });

    var header =
      'You are grading a frontend engineering interview. Below are ' +
      QUESTIONS.length +
      " questions and a candidate's answers.\n\n";

    var judge = [
      '---',
      '',
      'GRADING INSTRUCTIONS',
      '',
      'You are the judge. For each question, decide whether the candidate answer is correct.',
      'Mark "yes" only if the answer is substantively correct: it identifies the right mechanism and,',
      'where a fix or implementation was asked for, the fix or code would actually work.',
      'Ignore spelling, formatting, and style. Minor omissions are fine; a wrong mechanism is not.',
      'Mark "no" for any answer that is empty, "(no answer)", vague hand-waving, or correct-sounding but wrong.',
      '',
      'Return your response in exactly this format, one line per question, nothing else:',
      '',
      '1. yes',
      '2. no',
      '3. yes',
      '',
      'No preamble, no summary, no explanations, no score. Only the numbered yes/no lines.',
    ].join('\n');

    return header + lines.join('\n') + '\n' + judge + '\n';
  }

  /* One modal for both jobs: the manual-copy fallback and confirmations.
     window.confirm() is unavailable in a sandboxed iframe — it returns false
     without ever asking — so confirmations have to be in-page. */
  function showModal(title, text, payload, onConfirm) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-text').textContent = text;

    var box = document.getElementById('modal-payload');
    if (payload) {
      box.value = payload;
      box.hidden = false;
    } else {
      box.hidden = true;
    }

    var confirmBtn = document.getElementById('modal-confirm');
    var fresh = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(fresh, confirmBtn);

    if (onConfirm) {
      fresh.hidden = false;
      fresh.addEventListener('click', function () {
        closeModal();
        onConfirm();
      });
      document.getElementById('modal-close').textContent = 'Cancel';
    } else {
      fresh.hidden = true;
      document.getElementById('modal-close').textContent = 'Close';
    }

    document.getElementById('modal').hidden = false;
  }

  function closeModal() {
    document.getElementById('modal').hidden = true;
  }

  function showToast(message) {
    var toast = document.getElementById('toast');
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function () {
      toast.hidden = true;
    }, 3200);
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }

    /* file:// and http:// fall back to the legacy path */
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy') ? resolve() : reject(new Error('copy rejected'));
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(ta);
      }
    });
  }

  function evaluate() {
    var payload = buildPayload();
    var answered = QUESTIONS.filter(function (q, i) {
      return isAnswered(i + 1);
    }).length;
    var skipped = QUESTIONS.length - answered;

    var note =
      'Paste it into any LLM — it will reply with one yes/no line per question.' +
      (skipped ? ' ' + skipped + ' unanswered question' + (skipped === 1 ? '' : 's') + ' will be marked no.' : '');

    copyToClipboard(payload)
      .then(function () {
        showToast('Copied ' + QUESTIONS.length + ' questions + your answers. ' + note);
      })
      .catch(function () {
        showModal(
          'Copy it manually',
          'Clipboard access was blocked here. Click into the box below and select all, then copy. ' + note,
          payload,
        );
        document.getElementById('modal-payload').select();
      });
  }

  /* ---------- wiring ---------- */

  function init() {
    if (!QUESTIONS.length) {
      document.getElementById('questions').appendChild(
        el('p', 'prompt', 'No questions loaded — questions.js is missing or empty.'),
      );
      return;
    }

    render();

    document.querySelectorAll('.chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        applyFilter(chip.dataset.area);
      });
    });

    document.getElementById('evaluate-btn').addEventListener('click', evaluate);

    document.getElementById('reset-btn').addEventListener('click', function () {
      showModal('Clear all answers?', 'Every answer you have written will be deleted. This cannot be undone.', null, function () {
        answers = {};
        save();
        render();
        applyFilter(activeArea);
        showToast('Answers cleared.');
      });
    });

    document.getElementById('modal-close').addEventListener('click', closeModal);

    document.getElementById('modal').addEventListener('click', function (event) {
      if (event.target.id === 'modal') closeModal();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeModal();
    });
  }

  /* Scripts may run after the document is already parsed (inlined build), so
     don't wait for an event that has come and gone. */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
