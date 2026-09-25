/* =========================================
   🔐 PASSWORD GENERATOR + APP LOCKER
   ULUG'BEK.R
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       ELEMENTLAR
       ========================================= */

    const passwordInput = document.getElementById("password");
    const lengthRange = document.getElementById("length");
    const lengthValue = document.getElementById("lengthValue");

    const uppercaseCheck = document.getElementById("uppercase");
    const lowercaseCheck = document.getElementById("lowercase");
    const numbersCheck = document.getElementById("numbers");
    const symbolsCheck = document.getElementById("symbols");

    const generateBtn = document.getElementById("generateBtn");
    const newPasswordBtn = document.getElementById("newPasswordBtn");

    const copyBtn = document.getElementById("copyBtn");
    const showPasswordBtn = document.getElementById("showPasswordBtn");

    const strengthText = document.getElementById("strengthText");
    const strengthProgress = document.getElementById("strengthProgress");

    const historyList = document.getElementById("historyList");
    const clearHistoryBtn = document.getElementById("clearHistoryBtn");

    const themeToggle = document.getElementById("themeToggle");

    const appNameInput = document.getElementById("appName");
    const appPinInput = document.getElementById("appPin");
    const addAppBtn = document.getElementById("addAppBtn");

    const appList = document.getElementById("appList");

    const lockModal = document.getElementById("lockModal");
    const lockedAppName = document.getElementById("lockedAppName");
    const unlockPinInput = document.getElementById("unlockPin");
    const unlockBtn = document.getElementById("unlockBtn");
    const cancelUnlockBtn = document.getElementById("cancelUnlockBtn");

    const notificationContainer =
        document.getElementById("notificationContainer");


    /* =========================================
       LOCAL STORAGE KALITLARI
       ========================================= */

    const HISTORY_KEY = "ULUGBEK_password_history";
    const APPS_KEY = "ULUGBEK_app_locker";
    const THEME_KEY = "ULUGBEK_theme";


    /* =========================================
       O'ZGARUVCHILAR
       ========================================= */

    let history = loadHistory();
    let apps = loadApps();

    let selectedAppId = null;


    /* =========================================
       PASSWORD BELGILARI
       ========================================= */

    const CHARACTERS = {

        uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",

        lowercase: "abcdefghijklmnopqrstuvwxyz",

        numbers: "0123456789",

        symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?"
    };


    /* =========================================
       RANDOM BELGI
       ========================================= */

    function secureRandom(max) {

        if (
            window.crypto &&
            window.crypto.getRandomValues
        ) {
            const array = new Uint32Array(1);

            window.crypto.getRandomValues(array);

            return array[0] % max;
        }

        return Math.floor(Math.random() * max);
    }


    function randomCharacter(text) {

        return text[secureRandom(text.length)];
    }


    /* =========================================
       PASSWORD GENERATOR
       ========================================= */

    function generatePassword() {

        const length = parseInt(lengthRange.value);

        let selectedCharacters = "";

        const requiredCharacters = [];


        /* Uppercase */

        if (uppercaseCheck.checked) {

            selectedCharacters += CHARACTERS.uppercase;

            requiredCharacters.push(
                randomCharacter(CHARACTERS.uppercase)
            );
        }


        /* Lowercase */

        if (lowercaseCheck.checked) {

            selectedCharacters += CHARACTERS.lowercase;

            requiredCharacters.push(
                randomCharacter(CHARACTERS.lowercase)
            );
        }


        /* Numbers */

        if (numbersCheck.checked) {

            selectedCharacters += CHARACTERS.numbers;

            requiredCharacters.push(
                randomCharacter(CHARACTERS.numbers)
            );
        }


        /* Symbols */

        if (symbolsCheck.checked) {

            selectedCharacters += CHARACTERS.symbols;

            requiredCharacters.push(
                randomCharacter(CHARACTERS.symbols)
            );
        }


        /* Hech qanday tur tanlanmagan */

        if (selectedCharacters.length === 0) {

            showNotification(
                "Kamida bitta belgi turini tanlang!",
                "error"
            );

            return;
        }


        /* Tanlangan turlar soni uzunlikdan ko'p bo'lsa */

        const finalRequired =
            requiredCharacters.slice(0, length);


        let password = [...finalRequired];


        /* Qolgan belgilar */

        while (password.length < length) {

            password.push(
                randomCharacter(selectedCharacters)
            );
        }


        /* Aralashtirish */

        for (let i = password.length - 1; i > 0; i--) {

            const j = secureRandom(i + 1);

            [password[i], password[j]] =
                [password[j], password[i]];
        }


        const finalPassword = password.join("");

        passwordInput.value = finalPassword;

        passwordInput.type = "password";

        showPasswordBtn.textContent = "👁️";

        updateStrength(finalPassword);

        addToHistory(finalPassword);

        showNotification(
            "Yangi parol yaratildi!",
            "success"
        );
    }


    /* =========================================
       PASSWORD KUCHLILIGI
       ========================================= */

    function calculateStrength(password) {

        let score = 0;

        if (password.length >= 8) {
            score++;
        }

        if (password.length >= 12) {
            score++;
        }

        if (/[A-Z]/.test(password)) {
            score++;
        }

        if (/[a-z]/.test(password)) {
            score++;
        }

        if (/[0-9]/.test(password)) {
            score++;
        }

        if (/[^A-Za-z0-9]/.test(password)) {
            score++;
        }

        return score;
    }


    function updateStrength(password) {

        if (!password) {

            strengthText.textContent = "Kuchsiz";

            strengthProgress.style.width = "0%";

            return;
        }


        const score = calculateStrength(password);


        if (score <= 2) {

            strengthText.textContent = "Kuchsiz";

            strengthProgress.style.width = "30%";

            strengthProgress.style.background =
                "#ef4444";

        } else if (score <= 4) {

            strengthText.textContent = "O‘rtacha";

            strengthProgress.style.width = "65%";

            strengthProgress.style.background =
                "#f59e0b";

        } else {

            strengthText.textContent = "Kuchli";

            strengthProgress.style.width = "100%";

            strengthProgress.style.background =
                "#22c55e";
        }
    }


    /* =========================================
       RANGE
       ========================================= */

    lengthRange.addEventListener("input", () => {

        lengthValue.textContent =
            lengthRange.value;
    });


    /* =========================================
       GENERATE BUTTON
       ========================================= */

    generateBtn.addEventListener(
        "click",
        generatePassword
    );


    newPasswordBtn.addEventListener(
        "click",
        generatePassword
    );


    /* =========================================
       SHOW / HIDE PASSWORD
       ========================================= */

    showPasswordBtn.addEventListener("click", () => {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            showPasswordBtn.textContent = "🙈";

        } else {

            passwordInput.type = "password";

            showPasswordBtn.textContent = "👁️";
        }
    });


    /* =========================================
       COPY PASSWORD
       ========================================= */

    copyBtn.addEventListener("click", async () => {

        const password = passwordInput.value.trim();

        if (!password) {

            showNotification(
                "Avval parol yarating!",
                "error"
            );

            return;
        }


        try {

            await navigator.clipboard.writeText(password);

            showNotification(
                "Parol nusxalandi!",
                "success"
            );

        } catch (error) {

            /* Eski brauzerlar uchun */

            passwordInput.select();

            document.execCommand("copy");

            showNotification(
                "Parol nusxalandi!",
                "success"
            );
        }
    });


    /* =========================================
       HISTORY SAQLASH
       ========================================= */

    function loadHistory() {

        try {

            const saved =
                localStorage.getItem(HISTORY_KEY);

            return saved ? JSON.parse(saved) : [];

        } catch {

            return [];
        }
    }


    function saveHistory() {

        localStorage.setItem(
            HISTORY_KEY,
            JSON.stringify(history)
        );
    }


    function addToHistory(password) {

        if (!password) return;


        const item = {

            password: password,

            time: new Date().toLocaleString()
        };


        history.unshift(item);


        /* Maksimal 30 ta */

        if (history.length > 30) {

            history = history.slice(0, 30);
        }


        saveHistory();

        renderHistory();
    }


    function renderHistory() {

        if (!historyList) return;


        if (history.length === 0) {

            historyList.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">🔐</span>
                    Hali parollar tarixi yo‘q
                </div>
            `;

            return;
        }


        historyList.innerHTML = "";


        history.forEach((item, index) => {

            const div =
                document.createElement("div");

            div.className = "history-item";


            const passwordDiv =
                document.createElement("div");

            passwordDiv.className =
                "history-password";

            passwordDiv.textContent =
                item.password;


            const rightSide =
                document.createElement("div");

            rightSide.style.display = "flex";

            rightSide.style.alignItems = "center";

            rightSide.style.gap = "10px";


            const time =
                document.createElement("div");

            time.className =
                "history-time";

            time.textContent =
                item.time;


            const copy =
                document.createElement("button");

            copy.className =
                "small-btn";

            copy.textContent = "📋";

            copy.title = "Nusxalash";


            copy.addEventListener(
                "click",
                async () => {

                    try {

                        await navigator.clipboard
                            .writeText(item.password);

                        showNotification(
                            "Parol nusxalandi!",
                            "success"
                        );

                    } catch {

                        showNotification(
                            "Nusxalash amalga oshmadi!",
                            "error"
                        );
                    }
                }
            );


            rightSide.appendChild(time);

            rightSide.appendChild(copy);


            div.appendChild(passwordDiv);

            div.appendChild(rightSide);


            historyList.appendChild(div);
        });
    }


    /* =========================================
       CLEAR HISTORY
       ========================================= */

    clearHistoryBtn.addEventListener(
        "click",
        () => {

            if (history.length === 0) {

                showNotification(
                    "Tarix allaqachon bo‘sh!",
                    "info"
                );

                return;
            }


            const confirmed =
                confirm(
                    "Barcha parollar tarixini o‘chirishni xohlaysizmi?"
                );


            if (!confirmed) return;


            history = [];

            saveHistory();

            renderHistory();


            showNotification(
                "Tarix tozalandi!",
                "success"
            );
        }
    );


    /* =========================================
       THEME
       ========================================= */

    function loadTheme() {

        const savedTheme =
            localStorage.getItem(THEME_KEY);


        if (savedTheme === "light") {

            document.body.classList.add("light");

            themeToggle.textContent = "☀️";

        } else {

            document.body.classList.remove("light");

            themeToggle.textContent = "🌙";
        }
    }


    themeToggle.addEventListener(
        "click",
        () => {

            document.body.classList.toggle("light");


            const isLight =
                document.body.classList.contains("light");


            localStorage.setItem(
                THEME_KEY,
                isLight ? "light" : "dark"
            );


            themeToggle.textContent =
                isLight ? "☀️" : "🌙";
        }
    );


    /* =========================================
       APP LOCKER
       ========================================= */

    function loadApps() {

        try {

            const saved =
                localStorage.getItem(APPS_KEY);

            return saved ? JSON.parse(saved) : [];

        } catch {

            return [];
        }
    }


    function saveApps() {

        localStorage.setItem(
            APPS_KEY,
            JSON.stringify(apps)
        );
    }


    /* =========================================
       ADD APP
       ========================================= */

    addAppBtn.addEventListener(
        "click",
        addApp
    );


    function addApp() {

        const name =
            appNameInput.value.trim();

        const pin =
            appPinInput.value.trim();


        if (!name) {

            showNotification(
                "App nomini kiriting!",
                "error"
            );

            appNameInput.focus();

            return;
        }


        if (!pin) {

            showNotification(
                "PIN yoki parol kiriting!",
                "error"
            );

            appPinInput.focus();

            return;
        }


        if (pin.length < 4) {

            showNotification(
                "PIN kamida 4 ta belgidan iborat bo‘lsin!",
                "error"
            );

            return;
        }


        const exists =
            apps.some(
                app =>
                    app.name.toLowerCase() ===
                    name.toLowerCase()
            );


        if (exists) {

            showNotification(
                "Bu app allaqachon qo‘shilgan!",
                "error"
            );

            return;
        }


        const newApp = {

            id:
                Date.now().toString() +
                Math.random()
                    .toString(36)
                    .substring(2),

            name: name,

            pin: pin,

            createdAt:
                new Date().toLocaleString()
        };


        apps.push(newApp);

        saveApps();

        renderApps();


        appNameInput.value = "";

        appPinInput.value = "";


        showNotification(
            `${name} App Locker'ga qo‘shildi!`,
            "success"
        );
    }


    /* =========================================
       APP LIST
       ========================================= */

    function renderApps() {

        if (!appList) return;


        if (apps.length === 0) {

            appList.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">🔒</span>
                    Hali bloklangan app yo‘q
                </div>
            `;

            return;
        }


        appList.innerHTML = "";


        apps.forEach(app => {

            const item =
                document.createElement("div");

            item.className = "app-item";


            const info =
                document.createElement("div");

            info.className = "app-info";


            const icon =
                document.createElement("div");

            icon.className = "app-icon";

            icon.textContent = "🔒";


            const details =
                document.createElement("div");


            const name =
                document.createElement("div");

            name.className = "app-name";

            name.textContent = app.name;


            const status =
                document.createElement("div");

            status.className = "app-status";

            status.textContent = "🔐 Bloklangan";


            details.appendChild(name);

            details.appendChild(status);


            info.appendChild(icon);

            info.appendChild(details);


            const actions =
                document.createElement("div");

            actions.className = "app-actions";


            const unlock =
                document.createElement("button");

            unlock.className = "unlock-btn";

            unlock.textContent = "🔓 Ochish";


            unlock.addEventListener(
                "click",
                () => {

                    openLockModal(app.id);
                }
            );


            const remove =
                document.createElement("button");

            remove.className =
                "delete-app-btn";

            remove.textContent = "🗑️";


            remove.title =
                "Appni o‘chirish";


            remove.addEventListener(
                "click",
                () => {

                    removeApp(app.id);
                }
            );


            actions.appendChild(unlock);

            actions.appendChild(remove);


            item.appendChild(info);

            item.appendChild(actions);


            appList.appendChild(item);
        });
    }


    /* =========================================
       OPEN LOCK MODAL
       ========================================= */

    function openLockModal(id) {

        const app =
            apps.find(
                item => item.id === id
            );


        if (!app) return;


        selectedAppId = id;

        lockedAppName.textContent =
            app.name;


        unlockPinInput.value = "";


        lockModal.classList.remove("hidden");


        setTimeout(() => {

            unlockPinInput.focus();

        }, 100);
    }


    /* =========================================
       UNLOCK
       ========================================= */

    unlockBtn.addEventListener(
        "click",
        unlockApp
    );


    function unlockApp() {

        const app =
            apps.find(
                item => item.id === selectedAppId
            );


        if (!app) return;


        const enteredPin =
            unlockPinInput.value;


        if (!enteredPin) {

            showNotification(
                "PINni kiriting!",
                "error"
            );

            return;
        }


        if (enteredPin === app.pin) {

            closeLockModal();


            showNotification(
                `🔓 ${app.name} ochildi!`,
                "success"
            );


            /* Demo uchun */

            setTimeout(() => {

                alert(
                    `${app.name} muvaffaqiyatli ochildi!\n\nBu App Locker web-demo hisoblanadi.`
                );

            }, 200);

        } else {

            unlockPinInput.value = "";

            unlockPinInput.focus();


            showNotification(
                "❌ PIN noto‘g‘ri!",
                "error"
            );
        }
    }


    /* =========================================
       CLOSE MODAL
       ========================================= */

    cancelUnlockBtn.addEventListener(
        "click",
        closeLockModal
    );


    function closeLockModal() {

        lockModal.classList.add("hidden");

        unlockPinInput.value = "";

        selectedAppId = null;
    }


    /* =========================================
       DELETE APP
       ========================================= */

    function removeApp(id) {

        const app =
            apps.find(
                item => item.id === id
            );


        if (!app) return;


        const confirmed =
            confirm(
                `"${app.name}" appini o‘chirishni xohlaysizmi?`
            );


        if (!confirmed) return;


        apps =
            apps.filter(
                item => item.id !== id
            );


        saveApps();

        renderApps();


        showNotification(
            `${app.name} o‘chirildi!`,
            "success"
        );
    }


    /* =========================================
       ENTER - APP PIN
       ========================================= */

    unlockPinInput.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                unlockApp();
            }

            if (event.key === "Escape") {

                closeLockModal();
            }
        }
    );


    /* =========================================
       ESCAPE - MODAL
       ========================================= */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                !lockModal.classList.contains("hidden")
            ) {

                closeLockModal();
            }
        }
    );


    /* =========================================
       NOTIFICATION
       ========================================= */

    function showNotification(
        message,
        type = "info"
    ) {

        if (!notificationContainer) return;


        const notification =
            document.createElement("div");


        notification.className =
            `notification ${type}`;


        notification.textContent =
            message;


        notificationContainer.appendChild(
            notification
        );


        setTimeout(() => {

            notification.classList.add("hide");


            setTimeout(() => {

                notification.remove();

            }, 300);

        }, 2500);
    }


    /* =========================================
       PASSWORD INPUT O'ZGARSA
       ========================================= */

    passwordInput.addEventListener(
        "input",
        () => {

            updateStrength(
                passwordInput.value
            );
        }
    );


    /* =========================================
       ENTER - GENERATE
       ========================================= */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" &&
                document.activeElement !==
                appNameInput &&
                document.activeElement !==
                appPinInput &&
                document.activeElement !==
                unlockPinInput
            ) {

                generatePassword();
            }
        }
    );


    /* =========================================
       INITIAL HOLAT
       ========================================= */

    loadTheme();

    renderHistory();

    renderApps();


    /* Agar hech qanday parol bo‘lmasa */

    if (!passwordInput.value) {

        updateStrength("");
    }


    /* Boshlang‘ich uzunlik */

    lengthValue.textContent =
        lengthRange.value;

});