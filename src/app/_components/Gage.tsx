"use client";
export const Gage: React.FC<{ label: string; value: number }> = ({
  label,
  value,
}) => {
  const valueText = (value * 100).toFixed(1);
  return (
    <div className="relative pt-1">
      <div className="flex mb-2 items-center justify-between">
        <p className="flex items-center font-semibold gap-2">
          <span className="text-lg">{label}</span>
          <span className="text-xs inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-100">
            {valueText}
          </span>
        </p>
      </div>
      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-100">
        <div
          style={{ width: `${value * 100}%` }}
          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
        />
      </div>
    </div>
  );
};
