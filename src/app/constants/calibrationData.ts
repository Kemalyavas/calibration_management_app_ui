// Referans Cihaz Verileri (Belirsizlik değerleri ile)
export const referenceDevices = [
  {
    id: 'DR01',
    name: 'GE / Druck DPI 620 Gemi 35 bar (0,001 bar çözünürlük)',
    serial: 'DR01',
    uncertainty1: 0.5,
    uncertainty2: 0.5,
    uncertainty3: 0.5,
    uncertainty4: 0.5,
    uncertainty5: 0.5,
    uncertainty6: 0.5,
  },
  {
    id: 'R100',
    name: 'AMETEK / IPIMKII 03KG / 200 bar',
    serial: 'R100',
    uncertainty1: 0.3,
    uncertainty2: 0.3,
    uncertainty3: 0.3,
    uncertainty4: 0.3,
    uncertainty5: 0.3,
    uncertainty6: 0.3,
  },
];

// Test Cihazları (Tolerans değerleri ile)
export const testDevices = [
  {
    id: 'A002',
    name: 'BASINÇ ÖLÇER',
    serial: 'A002',
    calibrationFrequency: '6 ay',
    lastCalibrationDate: '2025-08-23',
    minRange: '0',
    maxRange: '100',
    verificationValue1: '10',
    verificationValue2: '25',
    verificationValue3: '40',
    verificationValue4: '60',
    verificationValue5: '80',
    verificationValue6: '100',
    tolerance1: 0.5,
    tolerance2: 0.5,
    tolerance3: 0.5,
    tolerance4: 0.5,
    tolerance5: 0.5,
    tolerance6: 0.5,
  },
  {
    id: 'B007',
    name: 'Uzunluk Ölçer',
    serial: 'B007',
    calibrationFrequency: '6 ay',
    lastCalibrationDate: '2025-09-15',
    minRange: '0',
    maxRange: '150',
    verificationValue1: '25',
    verificationValue2: '50',
    verificationValue3: '75',
    verificationValue4: '100',
    verificationValue5: '125',
    verificationValue6: '150',
    tolerance1: 1.0,
    tolerance2: 1.0,
    tolerance3: 1.0,
    tolerance4: 1.0,
    tolerance5: 1.0,
    tolerance6: 1.0,
  },
];

export type ReferenceDevice = typeof referenceDevices[0];
export type TestDevice = typeof testDevices[0];
