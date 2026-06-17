import { UserIcon } from "lucide-react";

const NoConversationFound = () => {
  return (
    <div className="flex flex-col items-center pt-10 px-4 text-center">
      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mb-3">
        <UserIcon className="h-6 w-6 text-gray-400" />
      </div>
      <h3 className="text-base font-medium text-gray-600">
        No conversations found
      </h3>
      <p className="text-sm text-gray-400">
        Start a new chat or adjust your search to see conversations.
      </p>
    </div>
  );
};

export default NoConversationFound;
