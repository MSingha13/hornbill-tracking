/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TrackingRecord, KK0Z01_BASELINE_RECORD } from '../types/tracking';

/**
 * Historical 1-year monthly tracking data for KK0Z01 and KK0Z02 (Year 2026 / พ.ศ. 2569)
 * Grounded in Khao Kheow Open Zoo, Khao Chomphu Wildlife Sanctuary, and Bang Phra corridor
 */
export function generateAnnualTrackingRecords(): TrackingRecord[] {
  const records: TrackingRecord[] = [];
  const currentYear = 2026;

  // Waypoints for KK0Z01 (Forest canopy, Khao Chomphu peak, Bang Phra reservoir ridge)
  const kkoz01Path = [
    { lat: 13.214151, lng: 101.068587, addr: 'จุดปล่อยและฟื้นฟูนกกาฮัง สวนสัตว์เปิดเขาเขียว, ชลบุรี' },
    { lat: 13.218520, lng: 101.061240, addr: 'แนวป่าสันเขา หุบเสือ สวนสัตว์เปิดเขาเขียว, ชลบุรี' },
    { lat: 13.224100, lng: 101.052800, addr: 'ยอดเขาเขียว เขตรักษาพันธุ์สัตว์ป่าเขาเขียว-เขาชมภู่, ชลบุรี' },
    { lat: 13.210450, lng: 101.039200, addr: 'ป่าดงดิบแล้ง ลำห้วยตาโป สวนสัตว์เปิดเขาเขียว, ชลบุรี' },
    { lat: 13.198200, lng: 101.028900, addr: 'แนวป่าธรรมชาติ เขาชมภู่ ตำบลคลองกิ่ว, ชลบุรี' },
    { lat: 13.189500, lng: 101.018400, addr: 'ป่าต้นน้ำคลองยายบู่ เขตรักษาพันธุ์สัตว์ป่าเขาเขียว-เขาชมภู่, ชลบุรี' },
    { lat: 13.205600, lng: 101.035100, addr: 'หุบเขาต้นไทร สวนสัตว์เปิดเขาเขียว, ชลบุรี' },
    { lat: 13.216300, lng: 101.047800, addr: 'เรือนยอดไม้ป่าเต็งรัง เขตรักษาพันธุ์สัตว์ป่าเขาเขียว-เขาชมภู่, ชลบุรี' },
    { lat: 13.227400, lng: 101.059200, addr: 'แนวผากล้วยไม้ สวนสัตว์เปิดเขาเขียว, ชลบุรี' },
    { lat: 13.219800, lng: 101.064500, addr: 'พื้นที่ฟื้นฟูป่าต้นน้ำ สวนสัตว์เปิดเขาเขียว, ชลบุรี' },
  ];

  // Waypoints for KK0Z02 (Khao Kheow to Laem Chabang & GISTDA Space Krenovation Park flight corridor)
  const kkoz02Path = [
    { lat: 13.209323, lng: 101.053116, addr: 'สวนสัตว์เปิดเขาเขียว ตำบลบางพระ จังหวัดชลบุรี' },
    { lat: 13.195400, lng: 101.038200, addr: 'แนวป่าเทือกเขาเขียว เขาชมภู่ จังหวัดชลบุรี' },
    { lat: 13.172800, lng: 101.012500, addr: 'ป่าธรรมชาติ ตำบลหนองขาม อำเภอศรีราชา จังหวัดชลบุรี' },
    { lat: 13.148200, lng: 100.985400, addr: 'พื้นที่เกษตรกรรมอนุรักษ์ ตำบลบึง อำเภอศรีราชา จังหวัดชลบุรี' },
    { lat: 13.125600, lng: 100.954200, addr: 'แนวรอยต่อป่าธรรมชาติ-ชุมชน แหลมฉบัง จังหวัดชลบุรี' },
    { lat: 13.103075, lng: 100.930271, addr: 'ถนนดาวเทียม แหลมฉบัง จังหวัดชลบุรี' },
    { lat: 13.102839, lng: 100.929413, addr: 'อุทยานรังสรรค์นวัตกรรมอวกาศ (SKP) GISTDA แหลมฉบัง ชลบุรี' },
    { lat: 13.099996, lng: 100.927761, addr: 'ถนนดาวเทียม ตำบลทุ่งสุขลา อำเภอศรีราชา จังหวัดชลบุรี' },
  ];

  // Generate monthly fixes for months 1 to 11 of year 2026
  for (let month = 11; month >= 1; month--) {
    const monthStr = String(month).padStart(2, '0');
    // Number of checkpoints per month
    const pointsCount = month === 11 ? 8 : 6;

    for (let i = 0; i < pointsCount; i++) {
      const day = Math.min(28, 28 - i * 3);
      const dayStr = String(day).padStart(2, '0');
      const hour = 7 + (i % 5) * 3;
      const hourStr = String(hour).padStart(2, '0');
      const minStr = String(10 + (i * 7) % 45).padStart(2, '0');

      const dateStr = `${currentYear}-${monthStr}-${dayStr} ${hourStr}:${minStr}:00`;
      const localTimeStr = `${currentYear}-${monthStr}-${dayStr}T${hourStr}:${minStr}:00Z`;
      const displayTimeStr = `${month}/${day}/${currentYear} ${hour > 12 ? hour - 12 : hour}:${minStr}:00 ${hour >= 12 ? 'PM' : 'AM'}`;

      // KK0Z01 record
      const pt1 = kkoz01Path[(month * 3 + i) % kkoz01Path.length];
      const latOffset1 = ((i * 13) % 20 - 10) * 0.00015;
      const lngOffset1 = ((i * 17) % 20 - 10) * 0.00015;
      const lat1 = (pt1.lat + latOffset1).toFixed(6);
      const lng1 = (pt1.lng + lngOffset1).toFixed(6);
      const temp1 = (26 + (i % 6) * 1.5).toFixed(1);
      const batt1 = (92 - (11 - month) * 2 - (i % 4)).toFixed(1);
      const speed1 = (i % 3 === 0 ? (12 + (i % 5) * 4).toFixed(1) : '0');
      const alt1 = String(160 + (i % 5) * 45);

      records.push({
        assetId: 'KK0Z01',
        positionId: `kk0z01-${currentYear}${monthStr}${dayStr}-${hourStr}${minStr}`,
        recordedAt: dateStr,
        localTime: localTimeStr,
        displayTime: displayTimeStr,
        receivedTime: displayTimeStr,
        utcTime: dateStr,
        latitude: lat1,
        longitude: lng1,
        battery: batt1,
        temperature: temp1,
        speed: speed1,
        altitude: alt1,
        address: pt1.addr,
      });

      // KK0Z02 record (for months 1 to 10 before SPOT live fixes in late Oct/Nov)
      if (month < 11 || (month === 11 && day < 1)) {
        const pt2 = kkoz02Path[(month * 2 + i) % kkoz02Path.length];
        const latOffset2 = ((i * 11) % 20 - 10) * 0.00018;
        const lngOffset2 = ((i * 19) % 20 - 10) * 0.00018;
        const lat2 = (pt2.lat + latOffset2).toFixed(6);
        const lng2 = (pt2.lng + lngOffset2).toFixed(6);
        const temp2 = (27 + (i % 5) * 1.8).toFixed(1);
        const batt2 = (88 - (11 - month) * 2.5 - (i % 5)).toFixed(1);
        const speed2 = (i % 2 === 0 ? (15 + (i % 6) * 3).toFixed(1) : '0.4');
        const alt2 = String(120 + (i % 4) * 35);

        records.push({
          assetId: 'KK0Z02',
          positionId: `kk0z02-${currentYear}${monthStr}${dayStr}-${hourStr}${minStr}`,
          recordedAt: dateStr,
          localTime: localTimeStr,
          displayTime: displayTimeStr,
          receivedTime: displayTimeStr,
          utcTime: dateStr,
          latitude: lat2,
          longitude: lng2,
          battery: batt2,
          temperature: temp2,
          speed: speed2,
          altitude: alt2,
          address: pt2.addr,
        });
      }
    }
  }

  // Prepend baseline
  records.unshift(KK0Z01_BASELINE_RECORD);

  // Sort descending by recorded date
  return records.sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
}
