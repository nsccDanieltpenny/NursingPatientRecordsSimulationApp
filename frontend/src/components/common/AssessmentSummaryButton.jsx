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
    FilterList as FilterIcon
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
        return key
            .replace(`patient-`, '')
            .replace(`-${id}`, '')
            .replace(/-/g, ' ');
    };

    // Get the appropriate icon and label for a category
    const getCategoryIcon = (category) => {
        const normalized = category.toLowerCase();
        
        if (normalized.includes('adl')) {
            return <><ADLIcon fontSize="small" color="primary" /> ADL</>;
        }
        if (normalized.includes('cognitive')) {
            return <><CognitiveIcon fontSize="small" color="primary" /> Cognitive</>;
        }
        if (normalized.includes('elimination')) {
            return <><EliminationIcon fontSize="small" color="primary" /> Elimination</>;
        }
        if (normalized.includes('mobility') || normalized.includes('safety')) {
            return <><MobilityandSafetyIcon fontSize="small" color="primary" /> Mobility / Safety</>;
        }
        if (normalized.includes('nutrition')) {
            return <><NutritionIcon fontSize="small" color="primary" /> Nutrition</>;
        }
        if (normalized.includes('sensory') || normalized.includes('prosthesis') || normalized.includes('skin')) {
            return <><SensoryAidsIcon fontSize="small" color="primary" /> Sensory Aids / Prosthesis / Skin Integrity</>;
        }
        if (normalized.includes('behaviour') || normalized.includes('mood')) {
            return <><MoodIcon fontSize="small" color="primary" /> Behaviour</>;
        }
        if (normalized.includes('progress') || normalized.includes('notes')) {
            return <><NoteIcon fontSize="small" color="primary" /> Progress Notes</>;
        }
        
        return <><ChevronRightIcon fontSize="small" color="primary" /> {category}</>;
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
                    const value = JSON.parse(localStorage.getItem(key));
                    const category = key.replace(prefix, '').split('-')[0];
                    uniqueCategories.add(category);
                    
                    entries.push({
                        key,
                        category,
                        displayName: formatCategoryName(key),
                        data: value,
                        timestamp: value.timestamp ? new Date(value.timestamp) : new Date(0),
                        priority: getCategoryPriority(category)
                    });
                } catch (err) {
                    console.error(`Error parsing data for key ${key}`, err);
                }
            }
        }

        // Sort entries by category priority first, then by timestamp
        entries.sort((a, b) => {
            // If same category, sort by timestamp
            if (a.priority === b.priority) {
                return sortOrder === 'newest' 
                    ? b.timestamp - a.timestamp 
                    : a.timestamp - b.timestamp;
            }
            // Otherwise sort by category priority
            return a.priority - b.priority;
        });

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
    }, [searchTerm, filterType, sortOrder, assessmentData]);

    const applyFilters = () => {
        let filtered = [...assessmentData];
        
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
        
        // Apply sort while maintaining category order
        filtered.sort((a, b) => {
            // If same category, sort by timestamp
            if (a.priority === b.priority) {
                return sortOrder === 'newest' 
                    ? b.timestamp - a.timestamp 
                    : a.timestamp - b.timestamp;
            }
            // Otherwise sort by category priority
            return a.priority - b.priority;
        });
        
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
            <Button variant="outline-primary" onClick={handleShowSummary}>
                Assessment Summary
            </Button>
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
                                onChange={(e) => setSortOrder(e.target.value)}
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
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
            
            // Group all mobility and safety entries together regardless of timestamp
            filteredData.forEach(entry => {
                const category = entry.category.toLowerCase();
                
                // Special handling for mobility and safety
                if (category.includes('mobility') || category.includes('safety')) {
                    if (!groupedByCategory['mobility_safety']) {
                        groupedByCategory['mobility_safety'] = {
                            category: 'mobility',
                            priority: getCategoryPriority('mobility'),
                            timestamp: entry.data.timestamp ? new Date(entry.data.timestamp) : null,
                            data: { ...entry.data }
                            
                        };
                    } else {
                        // Merge data from all mobility/safety entries
                        groupedByCategory['mobility_safety'].data = {
                            ...groupedByCategory['mobility_safety'].data,
                            ...entry.data
                        };
                        
                        // Use the newest timestamp
                        if (entry.data.timestamp && 
                            new Date(entry.data.timestamp) > groupedByCategory['mobility_safety'].timestamp) {
                            groupedByCategory['mobility_safety'].timestamp = new Date(entry.data.timestamp);
                        }
                    }
                } else {
                    // For other categories, group by category and timestamp
                    const timestampKey = entry.data.timestamp ? new Date(entry.data.timestamp).getTime() : 0;
                    const key = `${category}-${timestampKey}`;
                    
                    if (!groupedByCategory[key]) {
                        groupedByCategory[key] = {
                            category: entry.category,
                            priority: entry.priority,
                            timestamp: entry.data.timestamp ? new Date(entry.data.timestamp) : null,
                            data: { ...entry.data }
                        };
                    } else {
                        // Merge data from entries with same category and timestamp
                        groupedByCategory[key].data = {
                            ...groupedByCategory[key].data,
                            ...entry.data
                        };
                    }
                }
            });
            
            // Convert to array and sort by priority
            const groupedEntries = Object.values(groupedByCategory);
            groupedEntries.sort((a, b) => {
                if (a.priority === b.priority) {
                    return sortOrder === 'newest' 
                        ? b.timestamp - a.timestamp 
                        : a.timestamp - b.timestamp;
                }
                return a.priority - b.priority;
            });
            
            // Render the grouped entries
            return groupedEntries.map((entry, index) => {
                const isProgressNote = entry.category.toLowerCase().includes('progress') || 
                                      entry.category.toLowerCase().includes('notes');
                
                return (
                    <Card key={index} className="mb-4 shadow-sm border-0 assessment-card">
                        <Card.Header className="d-flex justify-content-between align-items-center bg-light">
                            <div className="d-flex align-items-center">
                                <span className="mb-0 text-capitalize fw-bold">{getCategoryIcon(entry.category)}</span>
                            </div>
                            {!isProgressNote && entry.timestamp && entry.timestamp.getFullYear() >= 2000 && (
                            <div className="text-end">
                                <div className="d-flex align-items-center">
                                    <CalendarIcon fontSize="small" className="me-1 text-primary" />
                                    <small>{formatDateTime(entry.timestamp)}</small>
                                </div>
                            </div>
                        )}


                        </Card.Header>
                        <Card.Body>
                            {/* For Progress Notes, show the note with date inside the card body */}
                            {isProgressNote ? (
                                <div className="mb-3">
                                    {entry.timestamp && formatDateTime(entry.timestamp) && (
                                    <div className="mb-2">
                                        <div className="d-flex align-items-center mb-2">
                                            <CalendarIcon fontSize="small" className="me-1 text-primary" />
                                            <small>{formatDateTime(entry.timestamp)}</small>
                                        </div>
                                    </div>
                                )}

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
                            {Object.entries(entry.data)
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
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AssessmentSummaryButton;