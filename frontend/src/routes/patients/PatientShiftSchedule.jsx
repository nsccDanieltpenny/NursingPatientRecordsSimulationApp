import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { useParams } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import "../../css/mar_shift_schedule_styles.css";
import { getMar } from "../../utils/api";

// shift schedule page for one patient
const ShiftSchedule = () => {
  // patient id from the url
  const { id } = useParams();
  const [MARData, setMARData] = useState();
  const [date, setDate] = useState(
    // formatTime(Date(), { buildInDate: true, separator: '-', time: false, monthNum: true })
    '2026-11-05'
  );
  const [ordersTimes, setOrdersTimes] = useState()
  const [scheduleData, setScheduleData] = useState('')
  const [tableTimes, setTableTimes] = useState('')
  const { user } = useUser();
  // get unique due times from orders
  useEffect(() => {
    const fetchPatientMAR = async () => {
      try {
        const results = await getMar(id, date);
        setMARData(results);
        setOrdersTimes([...new Set(results.orders.flatMap((order) => order.dueTimes ?? []))].sort())
      } catch (err) {
        console.error("Error fetching patient data:", err);
      }
    };
    fetchPatientMAR();
  }, [id, date]);

  // Todo: check user is student or instructor
  // if (isInstructor) { new order, student review, discontinue order}
  const isInstructor = user;

  return (
    <div className='container mt-4'>
      {/* patient name and info */}
      {/* will be delete after making a proper component for this */}
      <div className='bg-primary'>
        <h2>Jane Doe</h2>
        Room 204
        DOB 1948-03-22 (78 y)
        62 kg
        Admitted 2026-08-18
        Allergies: Penicillin, Morphine
        {/* Nav bar time view,if (isInstructor) { student view, new order } */}
        <h3>Time view
          Summary
          Student review</h3>
      </div>
      {/* ------------------body------------------ */}
      <div className='d-md-flex justify-content-md-between'>
        <div className='me-md-3'>
          {/* left side: filter and notes */}
          <div className='border rounded-3'>
            <div className="p-2 border-bottom">Note:</div>
            <div className="d-flex flex-wrap flex-md-column p-2">
              {[
                { cls: style.given, id: 'given', label: 'Given' },
                { cls: style.notGiven, id: 'not-given', label: 'Not Given' },
                { cls: style.dueNow, id: 'due-now', label: 'Due now (±60 min)' },
                { cls: style.overdue, id: 'overdue', label: 'Overdue' },
                { cls: style.responseDue, id: 'response-due', label: 'Response due' },
              ].map(({ cls, id, label }, idx) => (
                <span id={id} key={id} className={`d-flex align-items-center gap-1 text-nowrap ${idx !== 4 ? 'pe-2 pe-md-0' : ''}`}>
                  <i
                    className={cls.replace('rounded', '').replace('border-2', 'border-1')}
                    style={{ minWidth: '12px', minHeight: '12px', borderRadius: '3px', '--bs-border-width': '1.5px' }}
                  />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className='flex-grow-1 border rounded-3 overflow-hidden'>
          {/* right side: table */}
          {/* Time view: {time chosen, Date.now() by default}, < and > btn for date */}
          <Table borderless responsive className='m-0'>
            <thead>
              <tr key='head'>
                <th scope="col" className='col-5'>Medication</th>
                {ordersTimes ? ordersTimes.map(time => <th key={time} scope="col" className='text-center col-2 border-start'>{time}</th>) : ''}
              </tr>
            </thead>
            <tbody>
              <tr key='Scheduled'>
                <td colSpan="4" className='bg-primary-subtle text-primary-emphasis fw-bold border-top'>Scheduled</td>
              </tr>
              {MARData && ordersTimes ? MARData.orders.map((order) => (
                <tr key={order.medicationOrderId} className='border-top'>
                  <td
                  >
                    <b>
                      {order.drug.genericName}
                    </b>
                    <div>
                      {order.dose} {order.doseUnit}, {order.route}, {order.form}, {order.frequency}, {order.dueTimes.map(dueTime => `@${dueTime}`).join(' & ')}, {formatTime(order.startAt, {})}
                    </div>
                  </td>
                  {ordersTimes.length != 0 ? ordersTimes.map((time) => {
                    const slot = order.slots.find(slot => slot.dueTime === time)
                    let className = ''
                    let card = []
                    if (slot) {
                      if (slot?.dose) {
                        if (slot?.dose?.status === 'Given') {
                          const dosegiven = `${slot?.dose?.doseGiven} ${order.doseUnit}`
                          const status = `${slot?.dose?.status} ${formatTime(slot?.dose?.chartedAt, { year: false, month: false, day: false })}`
                          const [last, first] = slot?.dose?.chartedBy.fullName.split(', ') ?? [];
                          const chartedBy = `${first?.[0] ?? ''}. ${last ?? ''}`.trim();

                          className = style.given
                          card.push(dosegiven, status, chartedBy)
                        }
                        else if (slot?.dose?.status === 'NotGiven') {
                          className = style.notGiven
                          card.push('Not Given')
                        }
                      } else {
                        card.push('Due')
                      }
                    }
                    return <td key={order.medicationOrderId + time} className='border-start'>
                      {order.dueTimes.includes(time) ?
                        <div className={className + ' text-nowrap text-center p-1'}>
                          {card.map((i, idx) => <div key={`${order.medicationOrderId}-${time}-${idx}`}>{i}</div>)}
                        </div>
                        : ''}
                    </td>
                  }) : ''}
                </tr>
              )) : ''}
            </tbody>
          </Table>
        </div>
      </div>
    </div >
  )
}

export default ShiftSchedule

function formatTime(startAt, { year = true, month = true, monthNum = false, day = true, time = true, separator = ' ', map = false,
  // in case Date(), then buildInDate = true
  buildInDate = false }) {
  let date, m, d, y, h, min, s, timeZone, timeZoneName = '';
  [y, m, d, h, min] = startAt.split(/[-:T]/);
  if (buildInDate) {
    [date, m, d, y, h, min, s, timeZone, timeZoneName] = startAt.split(/[\s-:]/);
  }
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  // const formatted = `${y} ${months[+m - 1]} ${d} ${h}:${min}`;
  const result = []
  if (year) { result.push(y) }
  if (month) {
    if (buildInDate) {
      if (monthNum) {
        const mon = months.findIndex(i => i == m) + 1
        result.push(mon)
      } else {
        result.push(m)
      }
    } else {
      if (monthNum) {
        result.push(m)
      } else {
        result.push(months[+m - 1])
      }
    }
  }
  if (day) { result.push(d) }
  if (time) { result.push(h + ':' + min) }
  return map ? {
    year: y,
    month: m,
    day: d,
    hour: h,
    min: min,
  }
    : result.join(separator)
}

const style = {
  given: 'bg-success-subtle text-success border-success rounded border border-2',
  notGiven: 'bg-secondary-subtle border-secondary rounded border border-2',
  dueNow: '',
  overdue: 'bg-danger-subtle border-danger rounded border border-2',
  responseDue: 'bg-warning-subtle border-warning rounded border border-2',
}