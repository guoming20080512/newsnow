import { createPortal } from "react-dom"

interface ExternalLinkModalProps {
  url: string
  isOpen: boolean
  onClose: () => void
}

export function ExternalLinkModal({ url, isOpen, onClose }: ExternalLinkModalProps) {
  if (!isOpen) return null

  const handleContinue = () => {
    window.open(url, "_blank", "noopener,noreferrer")
    onClose()
  }

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center"
      style={{ zIndex: 2147483647, position: "fixed" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">即将离开本站</h1>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-500 mb-2">目标网址：</p>
          <p className="text-sm text-gray-800 break-all font-medium">{url}</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleContinue}
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 px-4 rounded-lg font-medium transition-colors duration-200"
          >
            继续访问
          </button>
          <button
            onClick={onClose}
            className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-700 text-center py-3 px-4 rounded-lg font-medium transition-colors duration-200"
          >
            取消
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
