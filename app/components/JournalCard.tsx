// components/JournalCard.tsx
interface JournalCardProps {
    title: string;
    lastEdited: string;
    onClick?: () => void;
  }
  
  export default function JournalCard({ title, lastEdited, onClick }: JournalCardProps) {
    return (
      <div
        onClick={onClick}
        className="border p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md hover:bg-gray-50 transition-all"
      >
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">Last edited: {lastEdited}</p>
      </div>
    );
  }
  