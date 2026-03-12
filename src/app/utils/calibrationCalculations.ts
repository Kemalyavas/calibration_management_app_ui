// Kalibrasyon hesaplama fonksiyonları

export interface StatusResult {
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  text: string;
}

/**
 * Histerisis hesaplama
 * @param ascending - Artan ölçüm değeri
 * @param descending - Azalan ölçüm değeri
 * @returns Histerisis değeri
 */
export const calculateHysteresis = (ascending: string, descending: string): string => {
  if (!ascending || !descending) return '';
  const hysteresis = Math.abs(parseFloat(ascending) - parseFloat(descending));
  return hysteresis.toFixed(7);
};

/**
 * Mutlak fark hesaplama
 * Formül: max(|artan - doğrulama|, |azalan - doğrulama|) + belirsizlik
 * @param ascending - Artan ölçüm değeri
 * @param descending - Azalan ölçüm değeri
 * @param verificationValue - Doğrulama değeri
 * @param uncertainty - Belirsizlik değeri
 * @returns Mutlak fark
 */
export const calculateAbsoluteDifference = (
  ascending: string,
  descending: string,
  verificationValue: string,
  uncertainty: number
): string => {
  if (!ascending || !descending || !verificationValue) return '';
  
  const asc = parseFloat(ascending);
  const desc = parseFloat(descending);
  const verif = parseFloat(verificationValue);
  const u = uncertainty || 0;
  
  const maxDiff = Math.max(Math.abs(asc - verif), Math.abs(desc - verif));
  return (maxDiff + u).toFixed(7);
};

/**
 * Uygunluk kontrolü - Tolerans bazlı
 * @param absoluteDifference - Mutlak fark değeri
 * @param tolerance - Tolerans değeri
 * @returns Durum bilgisi (ikon, renk, metin)
 */
export const getCalibrationStatus = (
  absoluteDifference: string,
  tolerance: number
): StatusResult => {
  if (!absoluteDifference || absoluteDifference === '') {
    return {
      icon: '-',
      color: 'gray',
      bgColor: 'bg-gray-100',
      borderColor: 'border-gray-300',
      text: 'BEKLİYOR'
    };
  }
  
  const absDiff = parseFloat(absoluteDifference);
  
  // Mutlak fark > Tolerans ise UYGUNSUZ
  if (absDiff > tolerance) {
    return {
      icon: '✗',
      color: 'red',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-500',
      text: 'UYGUNSUZ'
    };
  }
  
  return {
    icon: '✓',
    color: 'green',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-500',
    text: 'UYGUN'
  };
};
