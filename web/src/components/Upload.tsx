import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { assetService } from '../services/assetService';
import { Upload as UploadIcon, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';


export const Upload: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const navigate=useNavigate();

    const uploadMutation = useMutation({
        mutationFn: assetService.upload,
        onSuccess: () => {
            setFiles([]);
            navigate('/assets');    
            toast.success('Upload successful!');
        },
        onError: (error) => {
            console.error('Upload failed:', error);
            // toast.error('Upload failed'); // Handled by interceptor usually, but safe to keep if needed
        }
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(prev => [...prev, ...Array.from(e.target.files || [])]);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files) {
            setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Upload Assets</h2>

            <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50 hover:bg-white"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput')?.click()}
            >
                <div className="flex flex-col items-center">
                    <UploadIcon size={48} className="text-gray-400 mb-4" />
                    <p className="text-lg text-gray-600 font-medium">Drag & Drop files here</p>
                    <p className="text-sm text-gray-400 mt-2">or click to browse</p>
                    <input
                        type="file"
                        id="fileInput"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>
            </div>

            {files.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-3">Selected Files ({files.length})</h3>
                    <div className="bg-white rounded-lg shadow divide-y">
                        {files.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4">
                                <div className="flex items-center space-x-3">
                                    <File className="text-blue-500" size={20} />
                                    <div>
                                        <p className="font-medium text-gray-800">{file.name}</p>
                                        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                <button onClick={() => removeFile(idx)} className="text-gray-400 hover:text-red-500">
                                    <X size={20} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => uploadMutation.mutate(files)}
                        disabled={uploadMutation.isPending}
                        className={`mt-6 w-full py-3 px-4 rounded-lg font-semibold text-white shadow transition-colors flex items-center justify-center space-x-2
                            ${uploadMutation.isPending ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {uploadMutation.isPending ? (
                            <><span>Uploading...</span></>
                        ) : (
                            <><span>Upload {files.length} Files</span></>
                        )}
                    </button>

                    {uploadMutation.isError && (
                        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
                            <AlertCircle size={20} className="mr-2" />
                            Upload failed.
                        </div>
                    )}
                    {uploadMutation.isSuccess && (
                        <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-lg flex items-center">
                            <CheckCircle size={20} className="mr-2" />
                            Upload successful!
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
