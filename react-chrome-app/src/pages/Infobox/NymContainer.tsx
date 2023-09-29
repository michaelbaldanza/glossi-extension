import { Fragment } from 'react';
import Word from './Word';
import type { Lookup } from '../../services/types';

interface NymProps {
  lookupHistory: [
    Array<Lookup>, React.Dispatch<React.SetStateAction<Array<Lookup>>>
  ];
  lookupIdx: [number, React.Dispatch<React.SetStateAction<number>>];
  nyms: Array<string>;
  nymType: 'antonyms' | 'synonyms';
}

function NymContainer(props: NymProps) {
  const { nyms, nymType } = props;
  const nymSingular = nymType.slice(0, -1);

  return (
    <div className={`${nymSingular}-container`}>
      <h6 className="faded">{nymType}</h6>
      <div>
        {
          nyms.map((nym, idx) => {
            const spanId = nymSingular + '-' + nym + '-' + idx
            return (
              <Fragment
                key={spanId}>
                <Word
                  lookupHistory={props.lookupHistory}
                  lookupIdx={props.lookupIdx}
                  spanId={spanId}
                  text={nym}
                />
                {idx === nyms.length - 1 ? '' : ', '}
              </Fragment>
            );
          })
        }
      </div>
    </div>
  )
}

export default NymContainer;