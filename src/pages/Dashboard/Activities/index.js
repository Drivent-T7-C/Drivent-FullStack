import { useEffect, useState } from 'react';
import useTicket from '../../../hooks/api/useTicket';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import useTicketsTypes from '../../../hooks/api/useTicketsTypes';
import useEvent from '../../../hooks/api/useEvent';
import { eachDayOfInterval, parseISO } from 'date-fns';
import Day from './Day';
import Place from './Place';
export default function Activities() {
  const ticket = useTicket().ticket;
  const ticketType = useTicketsTypes().ticketsTypes;
  const event = useEvent().event;
  const [eventDays, setEventDays] = useState([]);
  const [eventPlaces, setEventPlaces] = useState([]);
  const [selectedDateBox, setSelectedDateBox] = useState(0);
  const [isPaid, setIsPaid] = useState(false);
  const [isRemote, setIsRemote] = useState(false);
  useEffect(() => {
    if(ticket) {
      if(ticket.status === 'RESERVED') {
        setIsPaid(false);
      } else {
        setIsPaid(true);
      }
      for(let i=0; i<ticketType.length; i++) {
        if(ticket.ticketTypeId === ticketType[i].id) {
          if(ticketType[i].isRemote === true) {
            setIsRemote(true);
          }
        }
      }
      setEventDays(eachDayOfInterval({ start: parseISO(event.startsAt), end: parseISO(event.endsAt) }));
      setEventPlaces(event.Places);
    }
  }, [ticket]);
  return (
    <>
      <StyledTypography variant="h4">Escolha de atividades</StyledTypography>
      { isPaid ? (
        <>
          { isRemote ? (
            <CenterWarning>
              <RemoteWarning variant="h6">Sua modalidade de ingresso não necessita escolher atividade. Você terá acesso a todas as atividades.</RemoteWarning>
            </CenterWarning>
          ):(
            <>
              { (selectedDateBox === 0) ? (
                <TypographyText variant="h6">Primeiro, filtre pelo dia do evento: </TypographyText>
              ):(
                <></>
              ) }
              <DatesBox>{eventDays.map((day, index) => <Day key={index} day={day} selectedDateBox={selectedDateBox} setSelectedDateBox={setSelectedDateBox} />)}</DatesBox>
              { (selectedDateBox !== 0) ? (
                <PlacesTrails>{(eventPlaces).map((place, index) => <Place key={index} place={place} selectedDateBox={selectedDateBox} />)}</PlacesTrails>
              ):(
                <></>
              ) }
            </>
          )}
        </>
      ):(
        <CenterWarning>
          <PaymentWarning variant="h6">Você precisa ter confirmado pagamento antes de fazer a escolha de atividades.</PaymentWarning>
        </CenterWarning>
      )}
    </>
  );
}

const PlacesTrails = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`;

const DatesBox = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 50px;
`;

const CenterWarning = styled.div`
  width: 100%;
  height: 85%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 23px;
  text-align: center;
  color: #8E8E8E;
`;

const PaymentWarning = styled(Typography)`
  width: 50%;
  color: #8E8E8E;
`;

const RemoteWarning = styled(Typography)`
  width: 60%;
  color: #8E8E8E;
`;

const StyledTypography = styled(Typography)`
  margin-bottom: 37px!important;
`;

const TypographyText = styled(Typography)`
  color: #8E8E8E;
`;
