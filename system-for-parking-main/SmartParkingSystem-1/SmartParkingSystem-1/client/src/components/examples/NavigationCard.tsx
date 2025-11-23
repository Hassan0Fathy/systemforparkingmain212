import NavigationCard from '../NavigationCard';
import { Car } from 'lucide-react';

export default function NavigationCardExample() {
  return (
    <NavigationCard
      title="Register Car"
      description="Add a new vehicle to the system"
      icon={Car}
      onClick={() => console.log('Navigation clicked')}
    />
  );
}
