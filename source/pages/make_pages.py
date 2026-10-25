"""Builds the privacy-policy, terms and privacy-requests pages into site/. Run: python3 source/pages/make_pages.py"""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
UPDATED = "2026-10-25"
LAYOUT = """<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>%(title)s</title><meta name="robots" content="noindex">
<script src="/privacy.js"></script>
<style>
:root{--bg:#0b0d1c;--panel:#181b36;--line:#3d4380;--ink:#f3f4fb;--dim:#a4a9d6;--accent:#ffb454;--mono:ui-monospace,Menlo,Consolas,monospace}
*{box-sizing:border-box}html,body{margin:0;background:var(--bg);color:var(--ink);font:18px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif}
main{max-width:820px;margin:0 auto;padding:20px 16px 60px}
h1{font:800 clamp(1.5rem,5vw,2.2rem) var(--mono);color:var(--accent);margin:8px 0}
h2{font:800 1.15rem var(--mono);color:var(--accent);margin:28px 0 6px}
a{color:#8ec5ff}a:focus-visible,button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible{outline:3px solid #ffe66d;outline-offset:2px}
p,li{color:#dfe2fb}.dim{color:var(--dim);font-size:.9rem}
table{border-collapse:collapse;width:100%%;margin:10px 0;font-size:.92rem}th,td{border:1px solid var(--line);padding:8px 10px;text-align:left;vertical-align:top}th{background:var(--panel)}
.tw{overflow-x:auto}.tw table{min-width:640px}
.box{background:var(--panel);border:2px solid var(--line);border-radius:12px;padding:12px 16px;margin:14px 0}
.top{display:flex;gap:14px;flex-wrap:wrap;font:700 .85rem var(--mono)}
label{display:block;margin:12px 0 4px;font-weight:700}input,select,textarea{width:100%%;padding:10px;border-radius:8px;border:2px solid var(--line);background:#0b0d1c;color:var(--ink);font:inherit}
button.b{font:800 .95rem var(--mono);padding:10px 16px;border-radius:10px;border:2px solid #7ef7c1;background:#0b0d1c;color:#7ef7c1;cursor:pointer;margin:6px 8px 6px 0}button.b.d{border-color:#ff6b6b;color:#ff6b6b}
.hp{position:absolute;left:-9999px}
</style></head><body><main>
<div class="top"><a href="/">⌂ Main screen</a><a href="/privacy-policy/">Privacy policy</a><a href="/terms/">Terms</a><a href="/privacy-requests/">Your data</a></div>
%(body)s
<p class="dim">Last updated %(updated)s. This page describes how this particular site works. It is not legal advice.</p>
</main></body></html>
"""

POLICY = """
<h1>Privacy policy</h1>
<div class="box"><b>The short version.</b> This site has no accounts, no cookies, no analytics, no ads and no third-party scripts. Your game progress stays in your own browser. We do not sell or share personal information, and we do not send anything to AI services.</div>

<h2>Who runs this site</h2>
<p>This is a personal study project run by one individual (the &ldquo;operator&rdquo;). The operator&rsquo;s name and postal address are not published on this page yet. To reach the operator about privacy, use the <a href="/privacy-requests/">privacy request form</a>.</p>

<h2>What data is involved</h2>
<div class="tw" tabindex="0" role="region" aria-label="Data table, scrolls sideways on small screens"><table>
<tr><th>Data</th><th>Why</th><th>Legal basis (GDPR)</th><th>How long</th><th>Shared with</th></tr>
<tr><td><b>Game progress and settings</b>: level results, stars, scores, and your switches (analogy, calm mode, sound). Stored <i>only in your browser</i> (localStorage keys beginning <code>studygame_</code>). It contains no name, email, password or token.</td><td>So the games remember where you were.</td><td>Strictly necessary for a feature you asked for; ePrivacy storage exemption.</td><td>Until you clear it, or automatically after 12 months without a visit.</td><td>Nobody. It never leaves your device.</td></tr>
<tr><td><b>Hosting logs</b>: your IP address, browser type, the page requested and the time, created by the hosting provider when any page loads.</td><td>To deliver the site and keep it secure.</td><td>Legitimate interests (Art. 6(1)(f)).</td><td>Kept by the host for a limited period under its own policy. The operator does not use them to identify visitors.</td><td>Netlify, Inc. (the host).</td></tr>
<tr><td><b>Privacy requests</b>: if you use the form, the email address you type, the request type and any details you add.</td><td>To answer your request.</td><td>Legal obligation and legitimate interests.</td><td>Deleted once the request is resolved, and no later than 90 days after.</td><td>Netlify, Inc. (receives form submissions on the operator&rsquo;s behalf).</td></tr>
</table></div>
<p>That is the whole list. The site sets <b>no cookies</b>. It collects no sensitive personal information, no precise location, and nothing from children knowingly.</p>

<h2>Third parties and sub-processors</h2>
<ul>
<li><b>Netlify, Inc.</b> (United States): hosts the site, serves it through a content network, and stores privacy-request form submissions. Transfers outside your country rely on the safeguards described in Netlify&rsquo;s own terms and privacy notice.</li>
<li><b>GitHub, Inc.</b>: stores the site&rsquo;s source code only. No visitor data goes there.</li>
</ul>
<p>There are <b>no</b> analytics, advertising, social-media, font, map or video services. <b>No content you enter is sent to any AI or large-language-model service.</b> A strict Content-Security-Policy header makes browsers refuse to load scripts, images or connections from any other site, so this cannot change by accident.</p>
<p>If an optional third-party service is ever added, it will be listed here first and will not load unless you opt in (the site&rsquo;s code has a consent gate for this).</p>

<h2>Global Privacy Control and opting out</h2>
<p>We honor the <b>Global Privacy Control (GPC)</b> signal. If your browser sends it, optional categories are treated as declined and cannot be switched on. We do not &ldquo;sell&rdquo; or &ldquo;share&rdquo; personal information as those words are defined in California law, so there is nothing to opt out of; GPC simply guarantees it.</p>

<h2>Your rights</h2>
<p><b>Everywhere:</b> you can see and delete what this site keeps in your browser at any time on the <a href="/privacy-requests/">Your data</a> page.</p>
<p><b>If you are in the EU/UK (GDPR):</b> you have the right to access, correct, erase, restrict or port your personal data, to object to processing based on legitimate interests, to withdraw consent where we rely on it, and to complain to your local data-protection authority.</p>
<p><b>If you are in California (CCPA/CPRA):</b> you have the right to know what we collect, to delete it, to correct it, to opt out of sale or sharing (we do neither), and not to be treated worse for using these rights. We collect no sensitive personal information.</p>
<p>To use any right about data the operator holds (hosting logs or a past request), send a request through the <a href="/privacy-requests/">form</a>. We reply within 30 days. The game progress in your browser is not held by us, so we cannot see it; the buttons on that page are the way to access or erase it.</p>

<h2>Security</h2>
<p>The site is served over HTTPS. It stores no passwords or tokens, writes nothing personal to your browser, and prints nothing personal to the browser console. Pages load code only from this site.</p>

<h2>Children</h2>
<p>The site is not directed to children under 13. If you think a child sent us personal information through the request form, tell us and we will delete it.</p>

<h2>Changes</h2>
<p>If this policy changes, the date at the bottom changes. Material changes, such as adding any third-party service, will be announced on the main screen.</p>
"""

TERMS = """
<h1>Terms of use</h1>
<p>By using this site you agree to these terms. If you do not agree, please do not use it.</p>
<h2>What this is</h2>
<p>Four study games for learning electrical and computer engineering topics. They are free, for personal learning, and provided by an individual (the &ldquo;operator&rdquo;). The explanations and numbers were written to help you study; they are not a substitute for your own course materials.</p>
<h2>No guarantee</h2>
<p>The games and explanations are provided <b>as is</b>, without any promise that they are complete, current or error-free. Always check results against your textbook and instructor before relying on them, for example in an exam or in real equipment. Never rely on this site for safety-critical work, including electrical safety.</p>
<h2>Using the site</h2>
<ul><li>Use it lawfully and fairly. Do not try to break, overload, scan or reverse-engineer the hosting.</li>
<li>Do not submit personal information about other people through the request form.</li>
<li>The operator may change or remove any part of the site at any time.</li></ul>
<h2>Content and ownership</h2>
<p>The site&rsquo;s text, code and artwork belong to the operator. You may play and share links to the site. Do not copy it wholesale or present it as your own. Names of products and standards mentioned belong to their owners.</p>
<h2>Liability</h2>
<p>To the extent allowed by law, the operator is not liable for any loss arising from using, or being unable to use, the site. Nothing here limits rights you have under law that cannot be limited, including consumer rights.</p>
<h2>Privacy</h2>
<p>How data is handled is described in the <a href="/privacy-policy/">privacy policy</a>.</p>
<h2>Governing law</h2>
<p>These terms are governed by the law of the place where the operator lives, without affecting mandatory consumer protections in your own country.</p>
"""

REQUESTS = """
<h1>Your data and privacy requests</h1>

<h2>1. Data saved in this browser</h2>
<p>This is the only personal-ish data the games keep (progress and settings). It lives on your device. Use these buttons to see it or erase it.</p>
<div class="box">
<button class="b" id="exp" type="button">Download my saved data (JSON)</button>
<button class="b d" id="del" type="button">Delete my saved data</button>
<p id="msg" class="dim" role="status" aria-live="polite"></p>
</div>
<p class="dim">Deleting resets your levels and stars on this device and also forgets that you dismissed the privacy notice. Saved data is also deleted automatically after 12 months without a visit.</p>

<h2>2. Ask the operator about data they hold</h2>
<p>The operator holds almost nothing about you. The only things are hosting logs kept by the host and any earlier request you sent. You can ask to <b>access</b> or <b>delete</b> these (your &ldquo;right to be forgotten&rdquo;), or send any other privacy question. We reply within 30 days.</p>
<p>The form collects only what is needed to answer you: an email address, the request type and optional details. It is received by Netlify, the host. Do not include passwords or sensitive information.</p>
<form name="privacy-request" method="POST" action="/privacy-requests/thanks/" data-netlify="true" netlify-honeypot="bot-field">
<input type="hidden" name="form-name" value="privacy-request">
<p class="hp"><label>Leave this empty <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
<label for="rt">What do you want?</label>
<select id="rt" name="request_type" required><option value="access">Access: show me what you hold about me</option><option value="delete">Delete: erase what you hold about me</option><option value="other">Another privacy question</option></select>
<label for="em">Your email (so we can reply)</label>
<input id="em" name="email" type="email" required autocomplete="email">
<label for="dt">Details (optional)</label>
<textarea id="dt" name="details" rows="4"></textarea>
<p><button class="b" type="submit">Send request</button></p>
</form>
<script>
(function () {
  var msg = document.getElementById('msg');
  document.getElementById('exp').onclick = function () {
    var blob = new Blob([JSON.stringify(Privacy.exportData(), null, 2)], { type: 'application/json' });
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'my-study-games-data.json'; a.click();
    msg.textContent = 'Downloaded.';
  };
  document.getElementById('del').onclick = function () {
    if (!confirm('Delete your saved progress on this device?')) return;
    Privacy.deleteData(); msg.textContent = 'Deleted. Your saved data on this device is gone.';
  };
})();
</script>
"""

THANKS = """
<h1>Request received</h1>
<p>Thank you. We will reply to the email you gave within 30 days. After your request is resolved, we delete it (no later than 90 days).</p>
<p><a href="/">Back to the main screen</a></p>
"""

PAGES = {
    "privacy-policy": ("Privacy policy", POLICY),
    "terms": ("Terms of use", TERMS),
    "privacy-requests": ("Your data", REQUESTS),
    "privacy-requests/thanks": ("Request received", THANKS),
}
for path, (title, body) in PAGES.items():
    out = os.path.join(ROOT, "site", path)
    os.makedirs(out, exist_ok=True)
    with open(os.path.join(out, "index.html"), "w", encoding="utf8") as f:
        f.write(LAYOUT % {"title": title + " · Study Games", "body": body, "updated": UPDATED})
    print("wrote", path)
