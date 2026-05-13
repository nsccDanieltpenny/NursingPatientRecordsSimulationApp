import React from "react";
import { Accordion, Card, Badge, Button } from "react-bootstrap";
import dayjs from "dayjs";
import "../css/instructor_assessment_panel_styles.css"

export default function AssessmentsPanel({ selectedDates, groupedData }) {


  return (
    <div
      className="ps-5 rounded"
      style={{ maxHeight: "750px", overflowY: "auto" }}
    >
      <h4 className="mb-2">Assessments</h4>
      <ul></ul>
  
      {!selectedDates.length && (
        <p className="p-3"><strong>No dates selected</strong></p>
      )}
      {selectedDates.map((date) => {
        const classes = groupedData[date];
        if (!classes) return null;

        return (
          <div key={date} className="mb-5">
            <h6 className="text-primary fs-5">
              {dayjs(date).format("MMM DD, YYYY")}
            </h6>

            <Accordion>
              {Object.entries(classes).map(([classId, records]) => {
                // GROUP RECORDS BY NURSE
                const nurses = {};

                records.forEach((rec) => {
                  const nurseName = rec.submittedNurse;

                  if (!nurses[nurseName]) nurses[nurseName] = [];
                  nurses[nurseName].push(rec);
                });

                return (
                  <Accordion.Item
                    eventKey={`${date}-${classId}`}
                    key={classId}
                    className="class-row-item"
                  >
                    <Accordion.Header >
                      Class {classId}

                    </Accordion.Header>

                    <Accordion.Body>

                      {/* Student List */}
                      <Accordion >
                        {Object.entries(nurses)
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([nurseName, nurseRecords], idx) => (
                            <Accordion.Item
                              eventKey={`${date}-${classId}-${idx}`}
                              key={nurseName}
                              className="mb-2"
                            >
                              <Accordion.Header>
                                {nurseName}
                                <Badge bg="info" className="ms-2">
                                  {nurseRecords.length}
                                </Badge>
                              </Accordion.Header>

                              <Accordion.Body>
                                {nurseRecords.map((rec) => (
                                  <Card
                                    key={rec.recordId}
                                    className="mb-2 p-2 d-flex flex-row justify-content-between align-items-center"
                                  >
                                    <div>
                                      Patient:<strong> {rec.patientName}</strong>

                                    </div>

                                    <Button
                                      size="sm"
                                      variant="primary"
                                      onClick={() =>
                                        console.log("view record", rec)
                                      }
                                    >
                                      View
                                    </Button>
                                  </Card>
                                ))}
                              </Accordion.Body>
                            </Accordion.Item>
                          )
                        )}
                      </Accordion>

                    </Accordion.Body>
                  </Accordion.Item>
                );
              })}
            </Accordion>
          </div>
        );
      })}
    </div>
  );
}