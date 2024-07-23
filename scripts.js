document.addEventListener('DOMContentLoaded', (event) => {
    loadDuties();
    checkAndClearOldDuties();
    setInterval(checkAndClearOldDuties, 24 * 60 * 60 * 1000); // ตรวจสอบทุก 24 ชั่วโมง
});

document.getElementById('dutyForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const studentName = document.getElementById('studentName').value;
    const dutyDate = document.getElementById('dutyDate').value;
    const dutyDetails = document.getElementById('dutyDetails').value;
    const dutyImage = document.getElementById('dutyImage').files[0];

    if (dutyImage) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageDataUrl = e.target.result;
            const duty = {
                studentName: studentName,
                dutyDate: dutyDate,
                dutyDetails: dutyDetails,
                dutyImage: imageDataUrl,
                timestamp: new Date().getTime()
            };
            saveDuty(duty);
            addDutyToLog(duty);
        };
        reader.readAsDataURL(dutyImage);
    } else {
        const duty = {
            studentName: studentName,
            dutyDate: dutyDate,
            dutyDetails: dutyDetails,
            dutyImage: null,
            timestamp: new Date().getTime()
        };
        saveDuty(duty);
        addDutyToLog(duty);
    }

    document.getElementById('dutyForm').reset();
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
