type ChatLoadingSpinnerProps = {
  ref?: React.Ref<HTMLDivElement>;
};

const ChatLoadingSpinner = ({ ref }: ChatLoadingSpinnerProps) => {
  return (
    <div
      className="flex w-full items-center justify-center pb-6 pt-1"
      ref={ref}
    >
      <div
        className="h-6 w-6 sm:h-7 sm:w-7 rounded-full border-2 border-gray-300 border-t-gray-600"
        style={{
          animation: "spin 0.9s linear infinite",
        }}
      />

      {/* inline animation */}
      <style>
        {`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};

export default ChatLoadingSpinner;
