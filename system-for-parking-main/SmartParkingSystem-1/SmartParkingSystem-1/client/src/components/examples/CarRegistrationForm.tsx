import CarRegistrationForm from '../CarRegistrationForm';

export default function CarRegistrationFormExample() {
  return (
    <CarRegistrationForm
      onSubmit={async (data) => {
        console.log('Form submitted:', data);
        return {
          qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
        };
      }}
    />
  );
}
