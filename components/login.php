<div id="loginWrap">
  <div class="login-box">
    <div class="login-logo">
      <div class="gov-badge">🏛 DDAS - PSED</div>
      <h1>Digital Document<br><span>Archiving System</span></h1>
      <p>Policies and Systems Evaluation Division</p>
    </div>
    <div class="fld"><label>Login</label>
      <div class="role-row">
        <div class="role-chip active" onclick="pickRole(this,'admin')">Admin</div>
        <div class="role-chip" onclick="pickRole(this,'staff')">Staff</div>
        <div class="role-chip" onclick="pickRole(this,'Viewer')">Viewer</div>
      </div>
    </div>
    <div class="fld"><label>Username</label><input id="lusr" placeholder="Username"></div>
    <div class="fld"><label>Password</label><input id="lpwd" type="password" placeholder="Password"></div>
    <button class="btn-login" onclick="doLogin()">Sign In to DDAS</button>
    <div class="login-err" id="loginErr">Incorrect username or password.</div>
    <div class="login-hint">Select a role above to explore different permissions</div>
  </div>
</div>