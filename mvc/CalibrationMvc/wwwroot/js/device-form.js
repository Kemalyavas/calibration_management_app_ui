document.addEventListener('DOMContentLoaded', function () {

    // Satir ekle
    document.getElementById('addVerificationRow')?.addEventListener('click', function () {
        const container = document.getElementById('verificationRows');
        const newIndex = container.querySelectorAll('.verification-row').length;

        const row = document.createElement('div');
        row.className = 'verification-row row mb-2 align-items-center';

        // Col 1: Dogrulama
        const col1 = document.createElement('div');
        col1.className = 'col-md-3';
        const inp1 = document.createElement('input');
        inp1.type = 'number';
        inp1.step = 'any';
        inp1.name = 'VerificationValues[' + newIndex + ']';
        inp1.className = 'form-control form-control-sm';
        inp1.placeholder = 'Dogrulama Degeri';
        col1.appendChild(inp1);

        // Col 2: Tolerans
        const col2 = document.createElement('div');
        col2.className = 'col-md-3';
        const inp2 = document.createElement('input');
        inp2.type = 'number';
        inp2.step = 'any';
        inp2.name = 'ToleranceValues[' + newIndex + ']';
        inp2.className = 'form-control form-control-sm tolerance-field';
        inp2.placeholder = 'Tolerans';
        col2.appendChild(inp2);

        // Col 3: Belirsizlik
        const col3 = document.createElement('div');
        col3.className = 'col-md-3';
        const inp3 = document.createElement('input');
        inp3.type = 'number';
        inp3.step = 'any';
        inp3.name = 'UncertaintyValues[' + newIndex + ']';
        inp3.className = 'form-control form-control-sm uncertainty-field';
        inp3.placeholder = 'Belirsizlik';
        col3.appendChild(inp3);

        // Col 4: Sil butonu
        const col4 = document.createElement('div');
        col4.className = 'col-md-3';
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'btn btn-outline-danger btn-sm remove-row';
        removeBtn.textContent = '\u00D7';
        removeBtn.addEventListener('click', function () {
            this.closest('.verification-row').remove();
            renumberRows();
        });
        col4.appendChild(removeBtn);

        row.appendChild(col1);
        row.appendChild(col2);
        row.appendChild(col3);
        row.appendChild(col4);
        container.appendChild(row);
    });

    // Cihaz tipi degisikligi
    document.getElementById('deviceType')?.addEventListener('change', function () {
        const isRef = this.value === 'reference';
        document.querySelectorAll('.tolerance-field').forEach(el => {
            const parent = el.closest('.col-md-3');
            if (parent) parent.style.display = isRef ? 'none' : '';
        });
        document.querySelectorAll('.uncertainty-field').forEach(el => {
            const parent = el.closest('.col-md-3');
            if (parent) parent.style.display = isRef ? '' : 'none';
        });
    });

    // Departman degisiminde makineleri yukle
    document.getElementById('departmentId')?.addEventListener('change', function () {
        const machineSelect = document.getElementById('machineId');
        if (!machineSelect) return;
        while (machineSelect.options.length > 0) machineSelect.remove(0);
        const defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.textContent = 'Makine Seciniz';
        machineSelect.appendChild(defaultOpt);

        if (this.value) {
            fetch('/Devices/GetMachines?departmentId=' + encodeURIComponent(this.value))
                .then(r => r.json())
                .then(machines => {
                    machines.forEach(m => {
                        const opt = document.createElement('option');
                        opt.value = String(m.id);
                        opt.textContent = m.name;
                        machineSelect.appendChild(opt);
                    });
                })
                .catch(function () { /* Sessizce gec */ });
        }
    });

    attachRemoveHandlers();
});

function attachRemoveHandlers() {
    document.querySelectorAll('.remove-row').forEach(btn => {
        btn.addEventListener('click', function () {
            this.closest('.verification-row').remove();
            renumberRows();
        });
    });
}

function renumberRows() {
    document.querySelectorAll('.verification-row').forEach(function (row, index) {
        row.querySelectorAll('input[name^="VerificationValues"]').forEach(input => {
            input.name = 'VerificationValues[' + index + ']';
        });
        row.querySelectorAll('input[name^="ToleranceValues"]').forEach(input => {
            input.name = 'ToleranceValues[' + index + ']';
        });
        row.querySelectorAll('input[name^="UncertaintyValues"]').forEach(input => {
            input.name = 'UncertaintyValues[' + index + ']';
        });
    });
}
