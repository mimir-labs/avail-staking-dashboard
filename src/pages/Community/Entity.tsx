// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { PageRow } from 'kits/Structure/PageRow';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useValidators } from 'contexts/Validators/ValidatorEntries';
import { CardWrapper } from 'library/Card/Wrappers';
import { ValidatorList } from 'library/ValidatorList';
import { useNetwork } from 'contexts/Network';
import { Item } from './Item';
import { ItemsWrapper } from './Wrappers';
import { useCommunitySections } from './context';
import type { Validator } from 'contexts/Validators/types';
import { ButtonSecondary } from 'kits/Buttons/ButtonSecondary';
import { PageHeadingWrapper } from 'kits/Structure/PageHeading/Wrapper';
import type { ValidatorSupportedChains } from '@w3ux/validator-assets';

export const Entity = () => {
  const { t } = useTranslation('pages');
  const { isReady } = useApi();
  const { network } = useNetwork();
  const { validators: allValidators } = useValidators();
  const { setActiveSection, activeItem } = useCommunitySections();

  const { name, validators: entityAllValidators } = activeItem;
  const validators =
    entityAllValidators[network as ValidatorSupportedChains] ?? [];

  // include validators that exist in `erasStakers`
  const [activeValidators, setActiveValidators] = useState<Validator[]>(
    allValidators.filter((v) => validators.includes(v.address))
  );

  useEffect(() => {
    setActiveValidators(
      allValidators.filter((v) => validators.includes(v.address))
    );
  }, [allValidators, network]);

  useEffect(() => {
    const newValidators = [...activeValidators];
    setActiveValidators(newValidators);
  }, [name, activeItem, network]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <PageRow>
      <PageHeadingWrapper>
        <ButtonSecondary
          text={t('community.goBack')}
          iconLeft={faChevronLeft}
          iconTransform="shrink-3"
          onClick={() => setActiveSection(0)}
        />
      </PageHeadingWrapper>
      <ItemsWrapper variants={container} initial="hidden" animate="show">
        <Item item={activeItem} actionable={false} />
      </ItemsWrapper>
      <CardWrapper>
        {!isReady ? (
          <div className="item">
            <h3>{t('community.connecting')}...</h3>
          </div>
        ) : (
          <>
            {activeValidators.length === 0 && (
              <div className="item">
                <h3>
                  {validators.length
                    ? `${t('community.fetchingValidators')}...`
                    : t('community.noValidators')}
                </h3>
              </div>
            )}
            {activeValidators.length > 0 && (
              <ValidatorList
                bondFor="nominator"
                validators={activeValidators}
                allowListFormat={false}
                selectable={false}
                allowMoreCols
                pagination
                toggleFavorites
                allowFilters
                refetchOnListUpdate
              />
            )}
          </>
        )}
      </CardWrapper>
    </PageRow>
  );
};
