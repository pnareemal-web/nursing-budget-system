// ระบบจัดเก็บข้อมูล
let currentUser = null;
let equipmentData = [];
let constructionData = [];

// กำหนดหน่วยงาน
const departments = [
    "งานบริการพยาบาล",
    "กลุ่มงานผู้ป่วยใน",
    "กลุ่มงานผู้ป่วยนอก",
    "OPD",
    "IPD1",
    "IPD2",
    "กลุ่มงานวิชาการพยาบาล",
    "งานเภสัชกรรม",
    "งานทันตกรรม",
    "กลุ่มงานบริหารทั่วไป",
    "งานการเงินและบัญชี",
    "งานพัสดุ"
];

// โหลดข้อมูลจาก localStorage
function loadData() {
    const savedEquipment = localStorage.getItem('equipmentData');
    const savedConstruction = localStorage.getItem('constructionData');
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedEquipment) {
        equipmentData = JSON.parse(savedEquipment);
    }
    if (savedConstruction) {
        constructionData = JSON.parse(savedConstruction);
    }
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserDisplay();
    }
    
    updateAllDisplays();
}

// บันทึกข้อมูลลง localStorage
function saveData() {
    localStorage.setItem('equipmentData', JSON.stringify(equipmentData));
    localStorage.setItem('constructionData', JSON.stringify(constructionData));
    if (currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
}

// จัดการการเข้าสู่ระบบ
function showLoginModal() {
    const modal = new bootstrap.Modal(document.getElementById('loginModal'));
    modal.show();
}

function handleLogin() {
    const dept = document.getElementById('loginDept').value;
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!dept || !username || !password) {
        alert('กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
    }
    
    currentUser = {
        username: username,
        department: dept,
        loginTime: new Date().toISOString()
    };
    
    saveData();
    updateUserDisplay();
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
    modal.hide();
    
    alert('เข้าสู่ระบบสำเร็จ');
}

function updateUserDisplay() {
    if (currentUser) {
        document.getElementById('userName').textContent = currentUser.username;
        document.getElementById('userDept').textContent = currentUser.department;
    }
}

// จัดการฟอร์มครุภัณฑ์
function showEquipmentForm() {
    if (!currentUser) {
        alert('กรุณาเข้าสู่ระบบก่อนเพิ่มข้อมูล');
        showLoginModal();
        return;
    }
    document.getElementById('equipmentFormSection').style.display = 'block';
    document.getElementById('equipmentForm').reset();
}

function hideEquipmentForm() {
    document.getElementById('equipmentFormSection').style.display = 'none';
}

// คำนวณงบประมาณรวม
document.getElementById('equipmentForm')?.addEventListener('input', function(e) {
    const form = e.target.form;
    if (form && form.name === 'equipmentForm') {
        const unitPrice = parseFloat(form.unitPrice.value) || 0;
        const totalUnit = parseFloat(form.totalUnit.value) || 0;
        form.totalBudget.value = unitPrice * totalUnit;
    }
});

// ส่งฟอร์มครุภัณฑ์
document.getElementById('equipmentForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!currentUser) {
        alert('กรุณาเข้าสู่ระบบก่อนบันทึกข้อมูล');
        return;
    }
    
    const formData = new FormData(e.target);
    const data = {
        id: Date.now(),
        department: currentUser.department,
        submittedBy: currentUser.username,
        submittedDate: new Date().toISOString(),
        fiscalYear: formData.get('fiscalYear'),
        priority: parseInt(formData.get('priority')),
        equipmentName: formData.get('equipmentName'),
        existingQty: parseInt(formData.get('existingQty')) || 0,
        requestedQty: parseInt(formData.get('requestedQty')),
        unit: formData.get('unit'),
        location: formData.get('location'),
        unitPrice: parseFloat(formData.get('unitPrice')),
        totalUnit: parseFloat(formData.get('totalUnit')),
        totalBudget: parseFloat(formData.get('totalBudget')),
        type: formData.get('type'),
        reason: formData.get('reason'),
        status: 'draft',
        trackingStatus: 0,  // สถานะการติดตาม: 0=ยังไม่เริ่ม, 1-5=ขั้นตอนต่างๆ
        statusHistory: []   // ประวัติการเปลี่ยนสถานะ
    };
    
    equipmentData.push(data);
    saveData();
    updateAllDisplays();
    hideEquipmentForm();
    
    alert('บันทึกข้อมูลครุภัณฑ์เรียบร้อยแล้ว');
});

// จัดการฟอร์มสิ่งปลูกสร้าง
function showConstructionForm() {
    if (!currentUser) {
        alert('กรุณาเข้าสู่ระบบก่อนเพิ่มข้อมูล');
        showLoginModal();
        return;
    }
    document.getElementById('constructionFormSection').style.display = 'block';
    document.getElementById('constructionForm').reset();
}

function hideConstructionForm() {
    document.getElementById('constructionFormSection').style.display = 'none';
}

// ส่งฟอร์มสิ่งปลูกสร้าง
document.getElementById('constructionForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!currentUser) {
        alert('กรุณาเข้าสู่ระบบก่อนบันทึกข้อมูล');
        return;
    }
    
    const formData = new FormData(e.target);
    const data = {
        id: Date.now(),
        department: currentUser.department,
        submittedBy: currentUser.username,
        submittedDate: new Date().toISOString(),
        fiscalYear: formData.get('fiscalYear'),
        priority: parseInt(formData.get('priority')),
        constructionName: formData.get('constructionName'),
        quantity: parseInt(formData.get('quantity')),
        unit: formData.get('unit'),
        budget: parseFloat(formData.get('budget')),
        type: formData.get('type'),
        location: formData.get('location'),
        reason: formData.get('reason'),
        status: 'draft',
        trackingStatus: 0,  // สถานะการติดตาม: 0=ยังไม่เริ่ม, 1-5=ขั้นตอนต่างๆ
        statusHistory: []   // ประวัติการเปลี่ยนสถานะ
    };
    
    constructionData.push(data);
    saveData();
    updateAllDisplays();
    hideConstructionForm();
    
    alert('บันทึกข้อมูลสิ่งปลูกสร้างเรียบร้อยแล้ว');
});

// อัพเดทการแสดงผลทั้งหมด
function updateAllDisplays() {
    updateDashboard();
    updateEquipmentTable();
    updateConstructionTable();
    updateDepartmentStatus();
}

// อัพเดท Dashboard
function updateDashboard() {
    // สรุปจำนวนและงบประมาณ
    const totalEq = equipmentData.length;
    const totalConst = constructionData.length;
    const totalEqBudget = equipmentData.reduce((sum, item) => sum + (item.totalBudget || 0), 0);
    const totalConstBudget = constructionData.reduce((sum, item) => sum + (item.budget || 0), 0);
    
    document.getElementById('totalEquipment').textContent = `${totalEq} รายการ`;
    document.getElementById('totalConstruction').textContent = `${totalConst} รายการ`;
    document.getElementById('totalEquipmentBudget').textContent = totalEqBudget.toLocaleString();
    document.getElementById('totalConstructionBudget').textContent = totalConstBudget.toLocaleString();
    
    // สร้างตารางแผนตามปี
    const yearlyData = {};
    const years = ['2569', '2570', '2571', '2572', '2573'];
    
    years.forEach(year => {
        yearlyData[year] = {
            eqCount: 0,
            eqBudget: 0,
            constCount: 0,
            constBudget: 0
        };
    });
    
    equipmentData.forEach(item => {
        if (yearlyData[item.fiscalYear]) {
            yearlyData[item.fiscalYear].eqCount++;
            yearlyData[item.fiscalYear].eqBudget += item.totalBudget || 0;
        }
    });
    
    constructionData.forEach(item => {
        if (yearlyData[item.fiscalYear]) {
            yearlyData[item.fiscalYear].constCount++;
            yearlyData[item.fiscalYear].constBudget += item.budget || 0;
        }
    });
    
    const tbody = document.getElementById('yearlyPlanTable');
    tbody.innerHTML = '';
    
    years.forEach(year => {
        const data = yearlyData[year];
        const total = data.eqBudget + data.constBudget;
        const row = `
            <tr>
                <td><strong>พ.ศ. ${year}</strong></td>
                <td>${data.eqCount}</td>
                <td>${data.eqBudget.toLocaleString()}</td>
                <td>${data.constCount}</td>
                <td>${data.constBudget.toLocaleString()}</td>
                <td><strong>${total.toLocaleString()}</strong></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// อัพเดทตารางครุภัณฑ์
function updateEquipmentTable() {
    const tbody = document.getElementById('equipmentTableBody');
    
    if (equipmentData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">ไม่มีข้อมูล กรุณาเพิ่มรายการครุภัณฑ์</td></tr>';
        return;
    }
    
    // กรองข้อมูลตามหน่วยงานของผู้ใช้ (ถ้าไม่ใช่แผน)
    let displayData = equipmentData;
    if (currentUser && currentUser.department !== 'กลุ่มงานบริหารทั่วไป') {
        displayData = equipmentData.filter(item => item.department === currentUser.department);
    }
    
    tbody.innerHTML = displayData.map((item, index) => {
        const trackingStatus = item.trackingStatus || 0;
        const statusLabels = [
            'ยังไม่เริ่ม',
            'บรรจุในแผน',
            'อนุมัติ คกก.บริหาร',
            'อนุมัติจากกรมฯ',
            'บันทึกจัดซื้อ/จ้าง',
            'ได้รับเรียบร้อย'
        ];
        
        const statusColors = [
            'secondary',
            'warning',
            'info',
            'primary',
            'success',
            'success'
        ];
        
        return `
            <tr>
                <td>${item.priority}</td>
                <td>พ.ศ. ${item.fiscalYear}</td>
                <td>${item.equipmentName}</td>
                <td>${item.requestedQty} ${item.unit}</td>
                <td>${item.totalBudget.toLocaleString()}</td>
                <td><span class="badge bg-info">${item.type}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-${statusColors[trackingStatus]}" 
                            onclick="showStatusModal(${item.id}, 'equipment')" 
                            title="คลิกเพื่อติดตามสถานะ">
                        <i class="bi bi-graph-up-arrow"></i> ${statusLabels[trackingStatus]}
                    </button>
                </td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editEquipment(${item.id})" title="แก้ไข">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteEquipment(${item.id})" title="ลบ">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// อัพเดทตารางสิ่งปลูกสร้าง
function updateConstructionTable() {
    const tbody = document.getElementById('constructionTableBody');
    
    if (constructionData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">ไม่มีข้อมูล กรุณาเพิ่มรายการสิ่งปลูกสร้าง</td></tr>';
        return;
    }
    
    // กรองข้อมูลตามหน่วยงานของผู้ใช้
    let displayData = constructionData;
    if (currentUser && currentUser.department !== 'กลุ่มงานบริหารทั่วไป') {
        displayData = constructionData.filter(item => item.department === currentUser.department);
    }
    
    tbody.innerHTML = displayData.map((item, index) => {
        const trackingStatus = item.trackingStatus || 0;
        const statusLabels = [
            'ยังไม่เริ่ม',
            'บรรจุในแผน',
            'อนุมัติ คกก.บริหาร',
            'อนุมัติจากกรมฯ',
            'บันทึกจัดซื้อ/จ้าง',
            'ได้รับเรียบร้อย'
        ];
        
        const statusColors = [
            'secondary',
            'warning',
            'info',
            'primary',
            'success',
            'success'
        ];
        
        return `
            <tr>
                <td>${item.priority}</td>
                <td>พ.ศ. ${item.fiscalYear}</td>
                <td>${item.constructionName}</td>
                <td>${item.quantity} ${item.unit}</td>
                <td>${item.budget.toLocaleString()}</td>
                <td><span class="badge bg-success">${item.type}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-${statusColors[trackingStatus]}" 
                            onclick="showStatusModal(${item.id}, 'construction')" 
                            title="คลิกเพื่อติดตามสถานะ">
                        <i class="bi bi-graph-up-arrow"></i> ${statusLabels[trackingStatus]}
                    </button>
                </td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editConstruction(${item.id})" title="แก้ไข">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteConstruction(${item.id})" title="ลบ">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// อัพเดทสถานะหน่วยงาน
function updateDepartmentStatus() {
    const tbody = document.getElementById('deptStatusTable');
    
    const deptStats = departments.map(dept => {
        const eqCount = equipmentData.filter(item => item.department === dept).length;
        const constCount = constructionData.filter(item => item.department === dept).length;
        const lastUpdate = getLastUpdateDate(dept);
        
        let status = 'ยังไม่ได้กรอก';
        let statusClass = 'status-draft';
        
        if (eqCount > 0 || constCount > 0) {
            status = 'กรอกแล้ว';
            statusClass = 'status-approved';
        }
        
        return {
            dept: dept,
            head: 'หัวหน้า' + dept,
            eqCount: eqCount,
            constCount: constCount,
            status: status,
            statusClass: statusClass,
            lastUpdate: lastUpdate
        };
    });
    
    tbody.innerHTML = deptStats.map(stat => `
        <tr>
            <td>${stat.dept}</td>
            <td>${stat.head}</td>
            <td>${stat.eqCount} รายการ</td>
            <td>${stat.constCount} รายการ</td>
            <td><span class="status-badge ${stat.statusClass}">${stat.status}</span></td>
            <td>${stat.lastUpdate}</td>
        </tr>
    `).join('');
}

function getLastUpdateDate(dept) {
    const allItems = [...equipmentData, ...constructionData]
        .filter(item => item.department === dept)
        .sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate));
    
    if (allItems.length === 0) return '-';
    
    const date = new Date(allItems[0].submittedDate);
    return date.toLocaleDateString('th-TH', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// ลบข้อมูล
function deleteEquipment(id) {
    if (!confirm('คุณต้องการลบรายการนี้หรือไม่?')) return;
    
    equipmentData = equipmentData.filter(item => item.id !== id);
    saveData();
    updateAllDisplays();
    alert('ลบข้อมูลเรียบร้อยแล้ว');
}

function deleteConstruction(id) {
    if (!confirm('คุณต้องการลบรายการนี้หรือไม่?')) return;
    
    constructionData = constructionData.filter(item => item.id !== id);
    saveData();
    updateAllDisplays();
    alert('ลบข้อมูลเรียบร้อยแล้ว');
}

// แก้ไขข้อมูล (ฟังก์ชันพื้นฐาน)
function editEquipment(id) {
    alert('ฟีเจอร์แก้ไขกำลังพัฒนา - สามารถลบและเพิ่มใหม่ได้ในขณะนี้');
}

function editConstruction(id) {
    alert('ฟีเจอร์แก้ไขกำลังพัฒนา - สามารถลบและเพิ่มใหม่ได้ในขณะนี้');
}

// ส่งออก Excel
function exportToExcel() {
    alert('ฟีเจอร์ส่งออก Excel กำลังพัฒนา - สามารถใช้ปุ่ม Print หรือ Save as PDF จากเบราว์เซอร์ได้');
}

// สร้างกราฟ
function createBudgetChart() {
    const ctx = document.getElementById('budgetChart');
    if (!ctx) return;
    
    const years = ['2569', '2570', '2571', '2572', '2573'];
    const eqBudgets = years.map(year => {
        return equipmentData
            .filter(item => item.fiscalYear === year)
            .reduce((sum, item) => sum + (item.totalBudget || 0), 0);
    });
    
    const constBudgets = years.map(year => {
        return constructionData
            .filter(item => item.fiscalYear === year)
            .reduce((sum, item) => sum + (item.budget || 0), 0);
    });
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: years.map(y => 'พ.ศ. ' + y),
            datasets: [
                {
                    label: 'ครุภัณฑ์',
                    data: eqBudgets,
                    backgroundColor: 'rgba(102, 126, 234, 0.7)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 1
                },
                {
                    label: 'สิ่งปลูกสร้าง',
                    data: constBudgets,
                    backgroundColor: 'rgba(118, 75, 162, 0.7)',
                    borderColor: 'rgba(118, 75, 162, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString() + ' บาท';
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + 
                                   context.parsed.y.toLocaleString() + ' บาท';
                        }
                    }
                }
            }
        }
    });
}

// เริ่มต้นระบบ
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    
    // สร้างกราฟเมื่อเปิด tab รายงาน
    document.getElementById('report-tab')?.addEventListener('shown.bs.tab', function() {
        createBudgetChart();
    });
});

// ระบบติดตามสถานะ
let currentTrackingItem = null;
let currentTrackingType = null;

function showStatusModal(id, type) {
    currentTrackingItem = id;
    currentTrackingType = type;
    
    const item = type === 'equipment' 
        ? equipmentData.find(item => item.id === id)
        : constructionData.find(item => item.id === id);
    
    if (!item) return;
    
    // แสดงชื่อรายการ
    const itemName = type === 'equipment' ? item.equipmentName : item.constructionName;
    document.getElementById('statusItemName').textContent = itemName;
    
    // อัพเดทสถานะปัจจุบัน
    const trackingStatus = item.trackingStatus || 0;
    document.getElementById('newStatus').value = trackingStatus.toString();
    
    // อัพเดท visual tracker
    updateStatusTracker(trackingStatus);
    
    // แสดงประวัติ
    displayStatusHistory(item.statusHistory || []);
    
    // ตั้งค่าวันที่เป็นวันนี้
    document.getElementById('statusDate').valueAsDate = new Date();
    document.getElementById('statusNote').value = '';
    
    const modal = new bootstrap.Modal(document.getElementById('statusModal'));
    modal.show();
}

function updateStatusTracker(currentStatus) {
    // Reset all steps
    for (let i = 1; i <= 5; i++) {
        const step = document.getElementById(`step-${i}`);
        step.classList.remove('active', 'current');
        
        if (i < currentStatus) {
            step.classList.add('active');
        } else if (i === currentStatus) {
            step.classList.add('current');
        }
    }
    
    // Update progress bar
    const progressBar = document.getElementById('statusProgressBar');
    if (progressBar) {
        let progress = 0;
        if (currentStatus > 0) {
            progress = ((currentStatus - 1) / 4) * 100; // 0%, 25%, 50%, 75%, 100%
        }
        progressBar.style.width = progress + '%';
    }
}

function updateStatus() {
    if (!currentTrackingItem || !currentTrackingType) return;
    
    const newStatusValue = parseInt(document.getElementById('newStatus').value);
    const note = document.getElementById('statusNote').value;
    const date = document.getElementById('statusDate').value;
    
    if (!date) {
        alert('กรุณาระบุวันที่');
        return;
    }
    
    // หา item ที่ต้องการอัพเดท
    const dataArray = currentTrackingType === 'equipment' ? equipmentData : constructionData;
    const item = dataArray.find(item => item.id === currentTrackingItem);
    
    if (!item) return;
    
    // อัพเดทสถานะ
    item.trackingStatus = newStatusValue;
    
    // เพิ่มประวัติ
    if (!item.statusHistory) {
        item.statusHistory = [];
    }
    
    const statusLabels = [
        'ยังไม่เริ่ม',
        'บรรจุในรายการแผน',
        'ผ่านการอนุมัติจาก คกก.บริหาร รพ.',
        'ได้รับอนุมัติจากกรมฯ',
        'บันทึกจัดซื้อ/จัดจ้าง',
        'ได้รับเรียบร้อย'
    ];
    
    item.statusHistory.push({
        status: newStatusValue,
        statusLabel: statusLabels[newStatusValue],
        note: note,
        date: date,
        updatedBy: currentUser ? currentUser.username : 'ไม่ระบุ',
        updatedAt: new Date().toISOString()
    });
    
    // บันทึกข้อมูล
    saveData();
    updateAllDisplays();
    
    // อัพเดท modal
    updateStatusTracker(newStatusValue);
    displayStatusHistory(item.statusHistory);
    
    alert('บันทึกสถานะเรียบร้อยแล้ว');
}

function displayStatusHistory(history) {
    const historyList = document.getElementById('historyList');
    
    if (!history || history.length === 0) {
        historyList.innerHTML = `
            <div class="list-group-item text-center text-muted">
                <i class="bi bi-inbox"></i> ยังไม่มีประวัติการอัพเดท
            </div>
        `;
        return;
    }
    
    // เรียงจากใหม่สุดไปเก่าสุด
    const sortedHistory = [...history].reverse();
    
    const statusIcons = {
        1: '📋',
        2: '✅',
        3: '🏆',
        4: '🛒',
        5: '🎉'
    };
    
    const statusColors = {
        1: 'warning',
        2: 'info',
        3: 'primary',
        4: 'success',
        5: 'success'
    };
    
    historyList.innerHTML = sortedHistory.map((h, index) => {
        const date = new Date(h.date).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const updatedAt = new Date(h.updatedAt).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const icon = statusIcons[h.status] || '📌';
        const color = statusColors[h.status] || 'secondary';
        
        return `
            <div class="list-group-item list-group-item-action">
                <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <div class="d-flex align-items-center mb-2">
                            <span style="font-size: 24px; margin-right: 10px;">${icon}</span>
                            <h6 class="mb-0">${h.statusLabel}</h6>
                        </div>
                        ${h.note ? `<p class="mb-2 text-muted"><i class="bi bi-chat-left-text"></i> ${h.note}</p>` : ''}
                        <small class="text-muted">
                            <i class="bi bi-calendar-event"></i> ${date} | 
                            <i class="bi bi-person-circle"></i> ${h.updatedBy} | 
                            <i class="bi bi-clock"></i> ${updatedAt}
                        </small>
                    </div>
                    <span class="badge bg-${color} ms-3" style="font-size: 16px;">
                        ${h.status}
                    </span>
                </div>
            </div>
        `;
    }).join('');
}

// ฟังก์ชันช่วยเหลือในการ migrate ข้อมูลเก่า
function migrateOldData() {
    let updated = false;
    
    equipmentData.forEach(item => {
        if (item.trackingStatus === undefined) {
            item.trackingStatus = 0;
            item.statusHistory = [];
            updated = true;
        }
    });
    
    constructionData.forEach(item => {
        if (item.trackingStatus === undefined) {
            item.trackingStatus = 0;
            item.statusHistory = [];
            updated = true;
        }
    });
    
    if (updated) {
        saveData();
    }
}

// เรียกใช้ migrate เมื่อโหลดข้อมูล
window.addEventListener('load', function() {
    migrateOldData();
});

