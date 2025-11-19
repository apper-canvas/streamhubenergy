import React, { useState, useRef, useEffect, useMemo } from 'react';

const ApperFileFieldComponent = ({ elementId, config }) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  
  const mountedRef = useRef(false);
  const elementIdRef = useRef(elementId);
  const existingFilesRef = useRef([]);

  // Update elementId ref when it changes
  useEffect(() => {
    elementIdRef.current = `file-uploader-${elementId}`;
  }, [elementId]);

  // Memoize existing files to prevent unnecessary re-renders
  const memoizedExistingFiles = useMemo(() => {
    if (!config.existingFiles) return [];
    
    const files = Array.isArray(config.existingFiles) ? config.existingFiles : [];
    
    // Check if files have changed by comparing length and first file's id/Id
    const currentLength = files.length;
    const previousLength = existingFilesRef.current.length;
    const firstFileChanged = files[0]?.id !== existingFilesRef.current[0]?.id && 
                            files[0]?.Id !== existingFilesRef.current[0]?.Id;
    
    if (currentLength !== previousLength || firstFileChanged) {
      return files;
    }
    
    return existingFilesRef.current;
  }, [config.existingFiles]);

  // Initial mount effect
  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 50;
    const checkInterval = 100;

    const initializeSDK = async () => {
      while (attempts < maxAttempts) {
        if (window.ApperSDK?.ApperFileUploader) {
          try {
            const { ApperFileUploader } = window.ApperSDK;
            
            await ApperFileUploader.FileField.mount(elementIdRef.current, {
              ...config,
              existingFiles: memoizedExistingFiles
            });
            
            mountedRef.current = true;
            existingFilesRef.current = memoizedExistingFiles;
            setIsReady(true);
            return;
          } catch (error) {
            console.error('Error mounting ApperFileField:', error);
            setError(`Mount error: ${error.message}`);
            return;
          }
        }
        
        attempts++;
        await new Promise(resolve => setTimeout(resolve, checkInterval));
      }
      
      setError('ApperSDK not loaded after 5 seconds. Please ensure the SDK script is included.');
    };

    initializeSDK();

    return () => {
      try {
        if (mountedRef.current && window.ApperSDK?.ApperFileUploader) {
          const { ApperFileUploader } = window.ApperSDK;
          ApperFileUploader.FileField.unmount(elementIdRef.current);
        }
      } catch (error) {
        console.error('Error unmounting ApperFileField:', error);
      }
      mountedRef.current = false;
      setIsReady(false);
    };
  }, [elementId, config.fieldKey]);

  // File update effect
  useEffect(() => {
    if (!isReady || !window.ApperSDK?.ApperFileUploader || !config.fieldKey) {
      return;
    }

    // Deep equality check
    const currentFiles = JSON.stringify(memoizedExistingFiles);
    const previousFiles = JSON.stringify(existingFilesRef.current);
    
    if (currentFiles === previousFiles) {
      return;
    }

    try {
      const { ApperFileUploader } = window.ApperSDK;
      
      // Check format - API format has Id, UI format has id
      let filesToUpdate = memoizedExistingFiles;
      if (filesToUpdate.length > 0 && filesToUpdate[0].Id !== undefined) {
        // Convert from API format to UI format
        filesToUpdate = ApperFileUploader.toUIFormat(filesToUpdate);
      }
      
      if (filesToUpdate.length > 0) {
        ApperFileUploader.FileField.updateFiles(config.fieldKey, filesToUpdate);
      } else {
        ApperFileUploader.FileField.clearField(config.fieldKey);
      }
      
      existingFilesRef.current = memoizedExistingFiles;
    } catch (error) {
      console.error('Error updating files:', error);
      setError(`Update error: ${error.message}`);
    }
  }, [memoizedExistingFiles, isReady, config.fieldKey]);

  if (error) {
    return (
      <div className="p-4 border border-red-300 rounded-md bg-red-50">
        <div className="text-red-800 text-sm font-medium">File Upload Error</div>
        <div className="text-red-600 text-sm mt-1">{error}</div>
      </div>
    );
  }

  return (
    <div className="file-upload-container">
      <div id={elementIdRef.current} className="min-h-[100px] border-2 border-dashed border-gray-300 rounded-lg">
        {!isReady && (
          <div className="flex items-center justify-center h-24 text-gray-500">
            <div className="text-sm">Loading file uploader...</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApperFileFieldComponent;