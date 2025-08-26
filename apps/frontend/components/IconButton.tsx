export const IconButton = ({icon, onClick, activated}: {
    icon: React.ReactNode, onClick: () => void, activated?: boolean
}) => {
    return <div className={`cursor-pointer rounded-full border p-2 bg-black hover:bg-gray-600 m-2 ${activated ? "text-red-400" : "text-white"}`} onClick={onClick}>
        {icon}
    </div> 
} 