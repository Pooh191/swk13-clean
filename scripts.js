document.addEventListener('DOMContentLoaded', (event) => {
    loadDuties();
    checkAndClearOldDuties();
    setInterval(checkAndClearOldDuties, 24 * 60 * 60 * 1000); // ตรวจสอบทุก 24 ชั่วโมง

    const logSection = document.getElementById('logSection');
    logSection.style.display = 'none';

    const dutyForm = document.getElementById('dutyForm');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminLoginSection = document.getElementById('adminLoginSection');
    const adminCredentials = { username: 'admin', password: 'admin' }; // Example credentials

    // Handle admin login form submission
    adminLoginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;

        if (username === adminCredentials.username && password === adminCredentials.password) {
            adminLoginSection.style.display = 'none';
            logSection.style.display = 'block';
        } else {
            alert('Invalid credentials');
        }
    });

    // Handle duty form submission
    dutyForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const reporterName = document.getElementById('reporterName').value;
        const studentName = document.getElementById('studentName').value;
        const dutyDate = document.getElementById('dutyDate').value;
        const dutyDetails = document.getElementById('dutyDetails').value;
        const dutyImage = document.getElementById('dutyImage').files[0];

        const duty = {
            reporterName: reporterName,
            studentName: studentName,
            dutyDate: dutyDate,
            dutyDetails: dutyDetails,
            dutyImage: dutyImage ? URL.createObjectURL(dutyImage) : null,
            timestamp: new Date().getTime()
        };
        
        saveDuty(duty);
        addDutyToLog(duty);

        dutyForm.reset();
    });
});

function saveDuty(duty) {
    let duties = JSON.parse(localStorage.getItem('duties')) || [];
    duties.push(duty);
    localStorage.setItem('duties', JSON.stringify(duties));
}

function loadDuties() {
    let duties = JSON.parse(localStorage.getItem('duties')) || [];
    duties.forEach(duty => {
        addDutyToLog(duty);
    });
}

function addDutyToLog(duty) {
    const logEntry = document.createElement('li');
    logEntry.innerHTML = `
        <strong>ชื่อผู้รายงาน:</strong> ${duty.reporterName}<br>
        <strong>ชื่อนักเรียน:</strong> ${duty.studentName}<br>
        <strong>วันที่:</strong> ${duty.dutyDate}<br>
        <strong>รายละเอียดงาน:</strong> ${duty.dutyDetails}
    `;
    if (duty.dutyImage) {
        const img = document.createElement('img');
        img.src = duty.dutyImage;
        img.alt = 'Duty Image';
        img.style.maxWidth = '200px';
        logEntry.appendChild(img);
    }
    document.getElementById('dutyLog').appendChild(logEntry);
}

function checkAndClearOldDuties() {
    let duties = JSON.parse(localStorage.getItem('duties')) || [];
    const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
    const now = new Date().getTime();

    duties = duties.filter(duty => now - duty.timestamp < oneWeekInMilliseconds);
    
    localStorage.setItem('duties', JSON.stringify(duties));
    document.getElementById('dutyLog').innerHTML = '';
    duties.forEach(duty => {
        addDutyToLog(duty);
    });
}
