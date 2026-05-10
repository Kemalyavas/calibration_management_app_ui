// Real-time kalibrasyon hesaplama
document.addEventListener('DOMContentLoaded', function () {

    // Cihaz seçim değişikliği — sayfa yenile
    const deviceSelect = document.getElementById('deviceSelect');
    if (deviceSelect) {
        deviceSelect.addEventListener('change', function () {
            if (this.value) {
                window.location.href = '/Calibrations/Create?deviceId=' + this.value;
            }
        });
    }

    // Referans cihaz seçim değişikliği — AJAX ile bilgi çek
    const refSelect = document.getElementById('referenceDeviceSelect');
    if (refSelect) {
        refSelect.addEventListener('change', function () {
            if (this.value) {
                fetch('/Calibrations/GetDeviceInfo?id=' + this.value)
                    .then(r => r.json())
                    .then(data => {
                        const nameEl = document.getElementById('refDeviceName');
                        const codeEl = document.getElementById('refDeviceCode');
                        if (nameEl) nameEl.textContent = data.deviceName || '-';
                        if (codeEl) codeEl.textContent = data.deviceCode || '-';
                    })
                    .catch(() => {
                        // Sessizce geç
                    });
            }
        });
    }

    // Ölçüm noktaları hesaplama
    document.querySelectorAll('.measurement-input').forEach(input => {
        input.addEventListener('input', function () {
            const point = this.dataset.point;
            calculatePoint(point);
        });
    });
});

// Virgül veya nokta fark etmez — her ikisini de kabul et
function parseNum(val) {
    if (!val) return 0;
    return parseFloat(val.toString().replace(',', '.')) || 0;
}

function calculatePoint(pointIndex) {
    const ascEl = document.getElementById('asc_' + pointIndex);
    const descEl = document.getElementById('desc_' + pointIndex);
    const verEl = document.getElementById('ver_' + pointIndex);
    const tolEl = document.getElementById('tol_' + pointIndex);
    const uncEl = document.getElementById('unc_' + pointIndex);

    const ascending = parseNum(ascEl?.value);
    const descending = parseNum(descEl?.value);
    const verification = parseNum(verEl?.dataset.value);
    const tolerance = parseNum(tolEl?.dataset.value);
    const uncertainty = parseNum(uncEl?.dataset.value);

    // Hysteresis = |Artan - Azalan|
    const hysteresis = Math.abs(ascending - descending);

    // MutlakFark = max(|Artan - Doğrulama|, |Azalan - Doğrulama|) + Belirsizlik
    const maxDiff = Math.max(
        Math.abs(ascending - verification),
        Math.abs(descending - verification)
    );
    const absoluteDiff = maxDiff + uncertainty;

    // Durum: ikisi de 0 ise Bekliyor, değilse tolerans kontrolü
    const isEmpty = (ascEl?.value === '' || ascEl?.value === '0' || ascEl?.value === undefined)
        && (descEl?.value === '' || descEl?.value === '0' || descEl?.value === undefined);
    const status = isEmpty ? 'Bekliyor' : (absoluteDiff > tolerance ? 'Uygunsuz' : 'Uygun');

    // Ekrana yaz
    const hysEl = document.getElementById('hys_' + pointIndex);
    const absEl = document.getElementById('abs_' + pointIndex);
    const statusEl = document.getElementById('status_' + pointIndex);

    if (hysEl) hysEl.textContent = hysteresis.toFixed(7);
    if (absEl) absEl.textContent = absoluteDiff.toFixed(7);
    if (statusEl) {
        statusEl.textContent = status;
        statusEl.className = 'badge ' + (
            status === 'Uygun' ? 'bg-success' :
            status === 'Uygunsuz' ? 'bg-danger' : 'bg-secondary'
        );
    }

    // Hidden input'lar (form gönderimi için)
    const hidHys = document.getElementById('hid_hys_' + pointIndex);
    const hidAbs = document.getElementById('hid_abs_' + pointIndex);
    if (hidHys) hidHys.value = hysteresis.toFixed(7);
    if (hidAbs) hidAbs.value = absoluteDiff.toFixed(7);

    updateOverallStatus();
}

function updateOverallStatus() {
    const statuses = document.querySelectorAll('[id^="status_"]');
    let hasUygunsuz = false;
    let allBekliyor = true;

    statuses.forEach(el => {
        if (el.textContent === 'Uygunsuz') hasUygunsuz = true;
        if (el.textContent !== 'Bekliyor') allBekliyor = false;
    });

    const overallEl = document.getElementById('overall-status');
    if (overallEl) {
        if (allBekliyor) {
            overallEl.textContent = 'Bekliyor';
            overallEl.className = 'badge bg-secondary fs-6';
        } else if (hasUygunsuz) {
            overallEl.textContent = 'Uygunsuz';
            overallEl.className = 'badge bg-danger fs-6';
        } else {
            overallEl.textContent = 'Uygun';
            overallEl.className = 'badge bg-success fs-6';
        }
    }
}
