import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Upload, Plus, Trash2, Download, Image as ImageIcon, X, CheckCircle2, AlertCircle } from 'lucide-react';

// Individual Photo Component within the Sortable Grid
const SortablePhoto = ({ id, photo, index, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-white aspect-square touch-manipulation"
    >
      {/* Number Badge */}
      <div className="absolute top-2 left-2 bg-black/70 text-white font-bold text-sm w-8 h-8 flex items-center justify-center rounded-full z-10 backdrop-blur-sm shadow-md">
        {index + 1}
      </div>

      {/* Remove Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(id);
        }}
        className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white p-1.5 rounded-full z-10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shadow-md"
        aria-label="Remove photo"
      >
        <X size={16} />
      </button>

      {/* Drag Handle & Image */}
      <div
        {...attributes}
        {...listeners}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <img
          src={photo.preview}
          alt={`Photo ${index + 1}`}
          className="w-full h-full object-cover pointer-events-none"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default function App() {
  const [photos, setPhotos] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);
  const [zipSuccess, setZipSuccess] = useState('');
  
  const fileInputRef = useRef(null);

  // Configure sensors for touch and mouse to enable smooth mobile drag-and-drop
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5, // Start dragging after moving 5px
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200, // Long press of 200ms to drag on mobile (allows scrolling)
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Cleanup object URLs to avoid memory leaks when component unmounts
  useEffect(() => {
    return () => {
      photos.forEach(photo => {
        URL.revokeObjectURL(photo.preview);
      });
    };
  }, []);

  const handleFileChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles = Array.from(e.target.files);
    
    const newPhotos = newFiles.map(file => ({
      id: crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${Math.random()}`,
      file: file,
      preview: URL.createObjectURL(file)
    }));

    setPhotos(prev => [...prev, ...newPhotos]);
    setZipSuccess(''); // Clear any previous success messages
    
    // Reset input so same files can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removePhoto = (idToRemove) => {
    setPhotos(prev => {
      const filtered = prev.filter(p => p.id !== idToRemove);
      // Revoke the URL of the removed photo
      const removedPhoto = prev.find(p => p.id === idToRemove);
      if (removedPhoto) {
        URL.revokeObjectURL(removedPhoto.preview);
      }
      return filtered;
    });
    setZipSuccess('');
  };

  const clearAll = () => {
    if (photos.length === 0) return;
    if (window.confirm('Are you sure you want to clear all selected photos?')) {
      photos.forEach(p => URL.revokeObjectURL(p.preview));
      setPhotos([]);
      setZipSuccess('');
    }
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setPhotos((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const generateZip = async () => {
    if (photos.length === 0) return;
    
    setIsZipping(true);
    setZipProgress(0);
    setZipSuccess('');
    
    try {
      const JSZipModule = typeof JSZip === 'function' ? JSZip : window.JSZip || JSZip;
      const zip = new JSZipModule();
      
      // Add files to zip in the exact sorted order
      photos.forEach((photo, index) => {
        // Extract original extension (e.g., "photo.jpg" -> "jpg")
        const fileNameParts = photo.file.name.split('.');
        const extension = fileNameParts.length > 1 ? fileNameParts.pop() : 'jpg'; 
        
        // Ensure sequential naming: 1.jpg, 2.png, etc.
        const newName = `${index + 1}.${extension}`;
        
        zip.file(newName, photo.file);
      });

      // Generate the ZIP blob with progress tracking
      const content = await zip.generateAsync({ type: 'blob' }, (metadata) => {
        setZipProgress(Math.round(metadata.percent));
      });
      
      // Trigger download
      saveAs(content, 'ordered_photos.zip');
      
      setZipSuccess(`ZIP created successfully — ${photos.length} photos`);
    } catch (error) {
      console.error('Error generating ZIP:', error);
      alert('Failed to generate ZIP file. Please try again.');
    } finally {
      setIsZipping(false);
      setZipProgress(0);
    }
  };

  const activePhoto = activeId ? photos.find(p => p.id === activeId) : null;
  const activeIndex = activeId ? photos.findIndex(p => p.id === activeId) : -1;

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: { opacity: '0.4' },
      },
    }),
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-100">
      {/* Hidden File Input */}
      <input
        type="file"
        multiple
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-2 flex items-center justify-center gap-3">
            <ImageIcon className="text-blue-600" size={36} />
            Photo Order & ZIP
          </h1>
          <p className="text-slate-500 max-w-lg mx-auto">
            Select photos directly from your device, drag to set their sequence, and download them perfectly numbered in a ZIP.
          </p>
        </div>

        {/* Top Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {photos.length === 0 ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
              >
                <Upload size={20} />
                Select Photos
              </button>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-lg font-medium transition-colors"
                disabled={isZipping}
              >
                <Plus size={18} />
                Add More
              </button>
            )}
            
            {photos.length > 0 && (
              <button
                onClick={clearAll}
                className="flex items-center gap-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 px-4 py-2.5 rounded-lg font-medium transition-colors"
                disabled={isZipping}
              >
                <Trash2 size={18} />
                Clear All
              </button>
            )}
          </div>

          <div className="flex items-center w-full sm:w-auto justify-between sm:justify-end gap-4">
            {photos.length > 0 && (
              <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {photos.length} photo{photos.length !== 1 ? 's' : ''} selected
              </span>
            )}
            
            {photos.length > 0 && (
              <button
                onClick={generateZip}
                disabled={isZipping || photos.length === 0}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all shadow-sm ${
                  isZipping 
                  ? 'bg-blue-400 cursor-not-allowed text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white shadow-green-600/20 shadow-lg'
                }`}
              >
                <Download size={20} />
                {isZipping ? 'Zipping...' : 'Download ZIP'}
              </button>
            )}
          </div>
        </div>

        {/* Progress & Success Messages */}
        {isZipping && (
          <div className="mb-6 bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
            <div className="flex justify-between text-sm mb-2 font-medium text-blue-800">
              <span>Generating ZIP file...</span>
              <span>{zipProgress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
                style={{ width: `${zipProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {zipSuccess && !isZipping && (
          <div className="mb-6 bg-green-50 text-green-800 border border-green-200 p-4 rounded-xl flex items-center gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="text-green-600" />
            <span className="font-medium">{zipSuccess}</span>
          </div>
        )}

        {/* Empty State */}
        {photos.length === 0 && (
          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 flex flex-col items-center justify-center text-center bg-slate-50/50">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
              <ImageIcon size={48} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No photos selected</h3>
            <p className="text-slate-500 max-w-sm mb-6">
              Click the button below to open your device's file picker and select the photos you want to arrange.
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
            >
              <Upload size={20} />
              Select Photos
            </button>
          </div>
        )}

        {/* Photos Grid Area */}
        {photos.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="mb-4 flex items-center gap-2 text-sm text-slate-500 bg-blue-50 text-blue-700 p-3 rounded-lg border border-blue-100">
              <AlertCircle size={16} className="shrink-0" />
              <p>
                <strong>Tip:</strong> Drag and drop the photos to reorder them. On mobile, press and hold briefly to drag. The numbers show the final sequence.
              </p>
            </div>
            
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
            >
              <SortableContext items={photos.map(p => p.id)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {photos.map((photo, index) => (
                    <SortablePhoto
                      key={photo.id}
                      id={photo.id}
                      photo={photo}
                      index={index}
                      onRemove={removePhoto}
                    />
                  ))}
                </div>
              </SortableContext>
              
              {/* Overlay while dragging */}
              <DragOverlay dropAnimation={dropAnimation}>
                {activeId && activePhoto ? (
                  <div className="relative rounded-xl overflow-hidden shadow-2xl border-2 border-blue-500 scale-105 bg-white aspect-square">
                    <div className="absolute top-2 left-2 bg-blue-600 text-white font-bold text-sm w-8 h-8 flex items-center justify-center rounded-full z-10 shadow-md">
                      {activeIndex + 1}
                    </div>
                    <img
                      src={activePhoto.preview}
                      alt="Dragging..."
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
        )}
      </div>
    </div>
  );
}