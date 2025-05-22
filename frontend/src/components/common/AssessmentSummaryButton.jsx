import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import {
    Restaurant as NutritionIcon,
    Wc as EliminationIcon,
    DirectionsWalk as MobilityandSafetyIcon,
    Checklist as ADLIcon,
    Psychology as CognitiveIcon,
    Hearing as SensoryAidsIcon,
    Note as NoteIcon,
    ChevronRight as ChevronRightIcon,
    Mood as MoodIcon,
    CalendarToday as CalendarIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
    Assessment as AssessmentIcon
} from '@mui/icons-material';
import '../../css/assessment_summary.css';

const AssessmentSummaryButton = () => {
    const { id } = useParams();
    const [show, setShow] = useState(false);
    const [assessmentData, setAssessmentData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [sortOrder, setSortOrder] = useState('newest');
    const [categories, setCategories] = useState([]);
    
    // Exact category order as specified
    const categoryPriority = {
        'adl': 1,
        'cognitive': 2,
        'elimination': 3,
        'mobility': 4,
        'nutrition': 5,
        'sensory': 6,
        'behaviour': 7,
        'mood': 7, // Same as behaviour
        'progress': 8,
        'notes': 8 // Same as progress
    };

    // In the formatDateTime function, add a check for invalid dates
    const formatDateTime = (isoString) => {
        if (!isoString) return '';
        
        const date = new Date(isoString);
        
        // Check if date is invalid or close to epoch
        if (date.getFullYear() < 2000) {
            return '';
        }
        
        return date.toLocaleString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        });
    };

    const formatCategoryName = (key) => {
        // First get the basic category name
        let categoryName = key
            .replace(`patient-`, '')
            .replace(`-${id}`, '')
            .replace(/-/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        
        // Apply special formatting for specific categories
        const lowerCaseName = categoryName.toLowerCase();
        
        if (lowerCaseName.includes('mobility')) {
            return 'Mobility / Safety';
        }
        
        if (lowerCaseName.includes('skin') || lowerCaseName.includes('sensory')) {
            return 'Sensory Aids / Prothesis / Skin Integrity';
        }
        
        return categoryName;
    };

    // Get the appropriate icon and label for a category
    const getCategoryIcon = (category) => {
        if (!category) return null;
        const normalized = category.toLowerCase();
        
        if (normalized.includes('adl')) {
            return <ADLIcon fontSize="small" color="primary" />;
        }
        if (normalized.includes('cognitive')) {
            return <CognitiveIcon fontSize="small" color="primary" />;
        }
        if (normalized.includes('elimination')) {
            return <EliminationIcon fontSize="small" color="primary" />;
        }
        if (normalized.includes('mobility') || normalized.includes('safety')) {
            return <MobilityandSafetyIcon fontSize="small" color="primary" />;
        }
        if (normalized.includes('nutrition')) {
            return <NutritionIcon fontSize="small" color="primary" />;
        }
        if (normalized.includes('sensory') || normalized.includes('prosthesis') || normalized.includes('skin')) {
            return <SensoryAidsIcon fontSize="small" color="primary" />;
        }
        if (normalized.includes('behaviour') || normalized.includes('mood')) {
            return <MoodIcon fontSize="small" color="primary" />;
        }
        if (normalized.includes('progress') || normalized.includes('notes')) {
            return <NoteIcon fontSize="small" color="primary" />;
        }
        
        return <ChevronRightIcon fontSize="small" color="primary" />;
    };

    // Get category priority for sorting
    const getCategoryPriority = (category) => {
        const normalized = category.toLowerCase();
        
        if (normalized.includes('adl')) return 1;
        if (normalized.includes('cognitive')) return 2;
        if (normalized.includes('elimination')) return 3;
        if (normalized.includes('mobility') || normalized.includes('safety')) return 4;
        if (normalized.includes('nutrition')) return 5;
        if (normalized.includes('sensory') || normalized.includes('prosthesis') || normalized.includes('skin')) return 6;
        if (normalized.includes('behaviour') || normalized.includes('mood')) return 7;
        if (normalized.includes('progress') || normalized.includes('notes')) return 8;
        
        return 999; // Default for unknown categories
    };

    const safeParseDate = (value) => {
        if (!value) return null;
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date;
    };

    // Function to track special fields from profile data
const trackProfileChanges = () => {
    const profileData = JSON.parse(localStorage.getItem(`patient-profile-${id}`)) || {};
    const entries = [];
    
    // Check for weight changes (linked to nutrition)
    if (profileData.weight) {
        // Get nutrition data to check if weight was updated there
        const nutritionData = JSON.parse(localStorage.getItem(`patient-nutrition-${id}`)) || {};
        
        if (nutritionData.date && nutritionData.method) {
            // This indicates weight was updated from nutrition route
            entries.push({
                key: `patient-nutrition-weight-${id}`,
                category: 'nutrition',
                displayName: 'Nutrition',
                data: {
                    weight: `${profileData.weight} lbs`,
                    note: "Weight assessment recorded"
                },
                timestamp: new Date(nutritionData.date),
                priority: getCategoryPriority('nutrition')
            });
        }
    }
    
    // Check for isolation precautions (linked to mobility/safety)
    if (profileData.isolationPrecautions === 'Yes' && 
        profileData.isolationPrecautionDetails && 
        profileData.isolationPrecautionsTimestamp) {
        
        entries.push({
            key: `patient-mobility-isolation-${id}`,
            category: 'mobility',
            displayName: 'Mobility / Safety',
            data: {
                isolation_precautions: 'Yes',
                precaution_type: profileData.isolationPrecautionDetails,
                note: "Isolation precautions implemented"
            },
            timestamp: new Date(profileData.isolationPrecautionsTimestamp),
            priority: getCategoryPriority('mobility')
        });
    }
    
    return entries;
};
    const loadAssessmentData = () => {
        const prefix = `patient-`;
        const suffix = `-${id}`;
        const entries = [];
        const uniqueCategories = new Set(['all']);
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (
                key.startsWith(prefix) &&
                key.endsWith(suffix) &&
                !key.includes(`patient-profile-${id}`)
            ) {
                try {
                    const rawValue = JSON.parse(localStorage.getItem(key));
                    // Remove keys ending in "Id" (case-insensitive)
                    const filteredValue = Object.fromEntries(
                        Object.entries(rawValue).filter(([k]) => !k.toLowerCase().endsWith('id'))
                    );
                    
                    const category = key.replace(prefix, '').split('-')[0];
                    uniqueCategories.add(category);
                    
                    // Extract timestamp and ensure it's a valid date
                    let timestamp = null;
                    
                    // Fix for progress notes timestamp issue
                    if (category.toLowerCase().includes('progress') || category.toLowerCase().includes('notes')) {
                        // For progress notes, use Timestamp (capital T) if available
                        if (rawValue.Timestamp) {
                            const date = new Date(rawValue.Timestamp);
                            if (!isNaN(date.getTime())) {
                                timestamp = date;
                            }
                        } else if (rawValue.timestamp) {
                            const date = new Date(rawValue.timestamp);
                            if (!isNaN(date.getTime())) {
                                timestamp = date;
                            }
                        }
                    } else {
                        // For other categories, use lowercase timestamp
                        if (rawValue.timestamp) {
                            const date = new Date(rawValue.timestamp);
                            if (!isNaN(date.getTime())) {
                                timestamp = date;
                            }
                        }
                    }
                    
                    entries.push({
                        key,
                        category,
                        displayName: formatCategoryName(key),
                        data: filteredValue,
                        timestamp: timestamp || new Date(0),
                        priority: getCategoryPriority(category)
                    });
                } catch (err) {
                    console.error(`Error parsing data for key ${key}`, err);
                }
            }
        }
        
        // Add tracked profile changes
        const profileChanges = trackProfileChanges();
        entries.push(...profileChanges);
        
        // Save categories first
        setCategories(Array.from(uniqueCategories));
        
        // Save unsorted data
        setAssessmentData(entries);
        
        // Apply initial filtering (which includes sorting)
        setTimeout(() => {
            applyFilters(entries);
        }, 0);
        
        // Sort by category priority and timestamp (newest/oldest toggle)
        entries.sort((a, b) => {
            if (a.priority === b.priority) {
                const aTime = a.timestamp instanceof Date ? a.timestamp.getTime() : 0;
                const bTime = b.timestamp instanceof Date ? b.timestamp.getTime() : 0;
                return sortOrder === 'newest' ? bTime - aTime : aTime - bTime;
            }
            return a.priority - b.priority;
        });
        
        // Save sorted data to state
        setCategories(Array.from(uniqueCategories));
        setAssessmentData(entries);
        setFilteredData(entries);
    };

    const handleShowSummary = () => {
        loadAssessmentData();
        setShow(true);
    };

    useEffect(() => {
        if (show) {
            applyFilters();
        }
    }, [searchTerm, filterType, sortOrder, assessmentData, show]);

    const applyFilters = (data = assessmentData) => {
        console.log("Applying filters with sort order:", sortOrder);
        
        let filtered = [...data];
        
        // Apply category filter
        if (filterType !== 'all') {
            filtered = filtered.filter(entry => entry.category === filterType);
        }
        
        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(entry => {
                // Search in display name
                if (entry.displayName.toLowerCase().includes(term)) return true;
                
                // Search in note content
                if (entry.data.note && entry.data.note.toLowerCase().includes(term)) return true;
                
                // Search in other fields
                return Object.entries(entry.data)
                    .some(([key, value]) => 
                         String(value).toLowerCase().includes(term) ||
                        key.toLowerCase().includes(term)
                    );
            });
        }
        
        // IMPORTANT: If we're using "newest" or "oldest" sort, IGNORE category priority completely
        // and sort purely by timestamp
        if (sortOrder === 'newest' || sortOrder === 'oldest') {
            filtered.sort((a, b) => {
                const aTime = a.timestamp instanceof Date ? a.timestamp.getTime() : 0;
                const bTime = b.timestamp instanceof Date ? b.timestamp.getTime() : 0;
                
                console.log(`Pure timestamp sort: ${a.category} (${aTime}) vs ${b.category} (${bTime})`);
                
                return sortOrder === 'newest' ? bTime - aTime : aTime - bTime;
            });
        } else {
            // Default sorting by category priority first, then by timestamp
            filtered.sort((a, b) => {
                if (a.priority === b.priority) {
                    const aTime = a.timestamp instanceof Date ? a.timestamp.getTime() : 0;
                    const bTime = b.timestamp instanceof Date ? b.timestamp.getTime() : 0;
                    return bTime - aTime; // Default to newest first within same category
                }
                return a.priority - b.priority;
            });
        }
        
        console.log("Filtered data after sorting:", filtered.map(f => ({
            category: f.category,
            timestamp: f.timestamp instanceof Date ? f.timestamp.toISOString() : null,
            sortOrder
        })));
        
        setFilteredData(filtered);
    };

    const handleClose = () => setShow(false);

    const getTimeDifference = (timestamp) => {
        if (!timestamp) return '';
        
        const now = new Date();
        const diff = now - new Date(timestamp);
        
        // Convert to days
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 30) return `${days} days ago`;
        if (days < 365) return `${Math.floor(days/30)} months ago`;
        return `${Math.floor(days/365)} years ago`;
    };

    return (
        <>
            <button 
            type="button"
            style={{
                backgroundColor: '#2e7d32',
                color: 'white',
                padding: '6px 16px',
                minWidth: '140px',
                fontSize: '0.875rem',
                fontWeight: '500',
                lineHeight: '1.75',
                borderRadius: '4px',
                textTransform: 'uppercase',
                boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
            }}
            onClick={handleShowSummary}
            >
                <AssessmentIcon style={{ marginRight: '8px', fontSize: '20px' }} />
                Assessment Summary
            </button>
            <Modal
                show={show}
                onHide={handleClose}
                size="xl"
                centered
                scrollable
                dialogClassName="flexible-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Assessment Summary</Modal.Title>
                </Modal.Header>
                <div className="modal-filter-bar p-3 border-bottom">
                    <div className="row g-2">
                        <div className="col-md-5">
                            <InputGroup>
                                <InputGroup.Text>
                                    <SearchIcon fontSize="small" />
                                </InputGroup.Text>

                                                                <Form.Control
                                    placeholder="Search assessments..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </InputGroup>
                        </div>
                        <div className="col-md-4">
                            <InputGroup>
                                <InputGroup.Text>
                                    <FilterIcon fontSize="small" />
                                </InputGroup.Text>
                                <Form.Select 
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                >
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                                        </option>
                                    ))}
                                </Form.Select>
                            </InputGroup>
                        </div>
                        <div className="col-md-3">
                            <Form.Select
                                value={sortOrder}
                                onChange={(e) => {
                                    console.log("Sort order changed to:", e.target.value);
                                    setSortOrder(e.target.value);
                                    // Force immediate re-filtering with the new sort order
                                    setTimeout(() => applyFilters(), 10);
                                }}
                            >
                                <option value="newest">Sort by Newest</option>
                                <option value="oldest">Sort by Oldest</option>
                                <option value="category">Sort by Category</option>
                            </Form.Select>
                        </div>
                    </div>
                </div>
                <Modal.Body>
                {filteredData.length === 0 ? (
                    <div className="text-center p-5">
                        <h5 className="text-muted">No assessment data found</h5>
                        <p>
                            {searchTerm || filterType !== 'all'
                                ? 'Try adjusting your search or filters'
                                : 'No assessments have been recorded for this patient'}
                        </p>
                    </div>
                ) : (
        (() => {
            // First, group entries by category and timestamp
             const groupedByCategory = {};
    
    filteredData.forEach(entry => {
        const category = entry.category.toLowerCase();
        
        // Special handling for mobility and safety
        let categoryKey = category;
        if (category.includes('mobility') || category.includes('safety')) {
            categoryKey = 'mobility_safety';
        }
        
        // Get timestamp for sorting later
        const timestamp = entry.timestamp instanceof Date ? entry.timestamp : new Date(0);
        
        if (!groupedByCategory[categoryKey]) {
    groupedByCategory[categoryKey] = {
        category: entry.category,
        priority: entry.priority,
        timestamp: timestamp,
        data: { ...entry.data }
    };
} else {
    // Merge data from entries with same category
    // For notes, we might want to keep them separate or combine them
    if (entry.data.note && groupedByCategory[categoryKey].data.note) {
        // If both have notes, we might want to combine them or keep the most recent
        // Here we're keeping the most recent one based on timestamp
        if (timestamp > groupedByCategory[categoryKey].timestamp) {
            groupedByCategory[categoryKey].data.note = entry.data.note;
            groupedByCategory[categoryKey].timestamp = timestamp;
        }
    } else if (entry.data.note) {
        groupedByCategory[categoryKey].data.note = entry.data.note;
    }
    
    // Merge all other data fields, avoiding redundancy
    Object.entries(entry.data).forEach(([key, value]) => {
        if (key !== 'note') {
            // Check for redundant fields 
            const redundantPairs = [
                ['method', 'weighing_method'],
                ['date', 'assessment_date']
            ];
            
            let shouldAdd = true;
            
            // Check if this is a redundant field
            for (const [field1, field2] of redundantPairs) {
                if ((key === field1 && groupedByCategory[categoryKey].data[field2]) || 
                    (key === field2 && groupedByCategory[categoryKey].data[field1])) {
                    // Skip adding this field if its pair already exists
                    shouldAdd = false;
                    break;
                }
            }
            
            if (shouldAdd) {
                groupedByCategory[categoryKey].data[key] = value;
            }
        }
    });
    
    // Update timestamp if this entry is newer
    if (timestamp > groupedByCategory[categoryKey].timestamp) {
        groupedByCategory[categoryKey].timestamp = timestamp;
        }
    }
});
    
    // Convert to array
    let groupedEntries = Object.values(groupedByCategory);
    
    // If using newest/oldest sort, ignore category priority completely
    if (sortOrder === 'newest' || sortOrder === 'oldest') {
        groupedEntries.sort((a, b) => {
            const aTime = a.timestamp instanceof Date ? a.timestamp.getTime() : 0;
            const bTime = b.timestamp instanceof Date ? b.timestamp.getTime() : 0;
            
            return sortOrder === 'newest' ? bTime - aTime : aTime - bTime;
        });
    } else {
        // Default sort by category priority first, then by timestamp
        groupedEntries.sort((a, b) => {
            if (a.priority === b.priority) {
                const aTime = a.timestamp instanceof Date ? a.timestamp.getTime() : 0;
                const bTime = b.timestamp instanceof Date ? b.timestamp.getTime() : 0;
                return bTime - aTime; // Default to newest first within same category
            }
            return a.priority - b.priority;
        });
    }
    
    // Render the sorted entries
    return groupedEntries.map((entry, index) => {
        const isProgressNote = entry.category.toLowerCase().includes('progress') ||
                              entry.category.toLowerCase().includes('notes');
        
        return (
            <Card
                key={index}
                className={`mb-4 shadow-sm border-0 assessment-card ${isProgressNote ? 'progress-note-card' : ''}`}
            >
                <Card.Header className="bg-light border-bottom py-3 px-4">
                    <div className="d-flex justify-content-between align-items-center w-100">
                        <div className="d-flex align-items-center gap-2">
                            {getCategoryIcon(entry.category)}
                            <h5 className="mb-0">{isProgressNote ? 'Progress Notes' : formatCategoryName(entry.category)}</h5>
                        </div>
                        {entry.timestamp && (
                            <div className="text-muted" style={{ fontSize: '0.95rem', marginLeft: '3rem', whiteSpace: 'nowrap', }}>
                                {formatDateTime(entry.timestamp)}
                            </div>
                        )}
                    </div>
                </Card.Header>
                <Card.Body>
                    {/* For Progress Notes, show the note with date inside the card body */}
                    {isProgressNote ? (
                        <div className="mb-3">
                            {/* DATE ONLY in Body */}
                            {entry.timestamp && (
                                <div className="mb-3">
                                    <div className="d-flex align-items-center">
                                        <strong>Date:</strong>&nbsp;
                                        <span>{new Date(entry.timestamp).toISOString().split('T')[0]}</span>
                                    </div>
                                </div>
                            )}
                            {/* NOTE */}
                            <div className="text-break">
                                <div
                                    className="p-3 bg-light border rounded"
                                    style={{
                                        whiteSpace: 'pre-wrap',
                                        overflowWrap: 'break-word',
                                        lineHeight: '1.5'
                                    }}
                                >
                                    {entry.data.note || "No notes provided"}
                                </div>
                            </div>
                        </div>
                    ) : (
                        // For other categories, show notes with icon if they exist
                        entry.data.note && (
                            <div className="mb-3 d-flex flex-wrap align-items-start">
                                <NoteIcon className="me-2 mt-1 text-primary" fontSize="small" />
                                <div className="flex-grow-1 text-break">
                                    <strong>Note:</strong>
                                    <div
                                        className="mt-2 p-3 bg-light border rounded"
                                        style={{
                                            whiteSpace: 'pre-wrap',
                                            overflowWrap: 'break-word',
                                            lineHeight: '1.5'
                                        }}
                                    >
                                        {entry.data.note}
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                    
                    {/* Dynamic Fields */}
                    {!isProgressNote && Object.entries(entry.data)
                        .filter(([key]) => key !== 'timestamp' && key !== 'note')
                        .length > 0 && (
                        <div className="row g-3">
                            {Object.entries(entry.data)
                                .filter(([key]) => key !== 'timestamp' && key !== 'note')
                                .map(([field, value], idx) => {
                                    // For Behaviour category, use full width
                                    const colClass = entry.category.toLowerCase().includes('behaviour') ||
                                                    entry.category.toLowerCase().includes('mood')
                                        ? "col-12 mb-2"  // Full width for behaviour
                                        : "col-md-6 mb-2"; // Half width for others
                                    
                                    return (
                                        <div key={idx} className={colClass}>
                                            <div className="assessment-field">
                                                <strong className="text-capitalize d-block mb-1">{field.replace(/_/g, ' ')}:</strong>
                                                <div 
                                                    className="bg-light border rounded p-3 text-break"
                                                    style={{
                                                        lineHeight: '1.5',
                                                        minHeight: '50px',
                                                        display: 'flex',
                                                        alignItems: 'flex-start'
                                                    }}
                                                >
                                                    {String(value)}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </Card.Body>
            </Card>
        );
    });
})()
)}
</Modal.Body>
            <Modal.Footer>
                    <div className="d-flex justify-content-between w-100">
                        <div>
                            <small className="text-muted">
                                Showing {filteredData.length} of {assessmentData.length} assessments
                            </small>
                        </div>
                        <button 
                    type="button"
                    style={{
                        backgroundColor: '#6c757d',
                        color: 'white',
                        padding: '8px 16px',
                        fontSize: '14px',
                        fontWeight: '500',
                        borderRadius: '4px',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                    onClick={handleClose}
                    >
                    Close
                    </button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AssessmentSummaryButton;
