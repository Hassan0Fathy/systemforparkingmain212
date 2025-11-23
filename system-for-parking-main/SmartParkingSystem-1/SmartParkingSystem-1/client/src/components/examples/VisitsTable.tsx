import VisitsTable from '../VisitsTable';

export default function VisitsTableExample() {
  const mockVisits = [
    {
      id: '1',
      plateNumber: 'ABC-1234',
      ownerName: 'Ahmed Hassan',
      checkInTime: new Date('2025-11-08T10:30:00'),
      checkOutTime: new Date('2025-11-08T12:45:00'),
      duration: 135,
      fee: 20,
      isCheckedIn: false,
    },
    {
      id: '2',
      plateNumber: 'XYZ-5678',
      ownerName: 'Sara Mohamed',
      checkInTime: new Date('2025-11-08T14:15:00'),
      checkOutTime: null,
      duration: null,
      fee: null,
      isCheckedIn: true,
    },
    {
      id: '3',
      plateNumber: 'DEF-9012',
      ownerName: 'Omar Ali',
      checkInTime: new Date('2025-11-08T09:00:00'),
      checkOutTime: new Date('2025-11-08T11:30:00'),
      duration: 150,
      fee: 20,
      isCheckedIn: false,
    },
  ];

  return (
    <VisitsTable
      visits={mockVisits}
      onRefresh={() => console.log('Refresh clicked')}
      onExport={() => console.log('Export clicked')}
    />
  );
}
