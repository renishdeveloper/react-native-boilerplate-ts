import React, { useContext, useState } from 'react';
import { CustomText, Layout } from '@CommonComponent/index';
import { ButtonComponent } from '@SubComponents/index';
import BottomModalContainer from '@CommonComponent/BottommodalContainer';
import { useToast } from 'react-native-styled-toast';
import { AppContext } from '@AppContext/index';

const Home = () => {
  const [isShowModal, setShowModal] = useState(false);
  const { toast } = useToast();
  const { appTheme } = useContext(AppContext);

  const showToast = () => {
    toast({
      message: 'Toast message',
      color: appTheme.lightText,
      duration: 3000,
      subMessage: 'This is the sample toast message sub message',
      toastStyles: {
        bg: appTheme.background,
        borderRadius: 16,
      },
      hideIcon: true,
      hideCloseIcon: true,
    });
  };

  return (
    <Layout title="Widgets" padding={20}>
      <CustomText large>Home screen</CustomText>
      <ButtonComponent
        onPress={() => {
          setShowModal(true);
        }}
        title={'Show Modal'}
      />
      <ButtonComponent onPress={showToast} title={'Show Toast'} />
      <BottomModalContainer
        title={'Modal'}
        onClose={() => setShowModal(false)}
        show={isShowModal}>
        <CustomText large>Modal</CustomText>
      </BottomModalContainer>
    </Layout>
  );
};

export default Home;
