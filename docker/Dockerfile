ARG BASE_IMAGE=arm32v7/alpine
FROM $BASE_IMAGE

RUN apk add --no-cache bash tzdata eudev ca-certificates

ENV LANG C.UTF-8

# Build telldus-core
RUN apk add --no-cache \
  confuse libftdi1 libstdc++ jq socat \
  && apk add --no-cache --virtual .build-dependencies \
  cmake build-base gcc doxygen confuse-dev argp-standalone libftdi1-dev git \
  && ln -s /usr/include/libftdi1/ftdi.h /usr/include/ftdi.h \
  && mkdir -p /usr/src \
  && cd /usr/src \
  && git clone -b master --depth 1 https://github.com/majori/telldus \
  && cd telldus/telldus-core \
  && sed -i "/\<sys\/socket.h\>/a \#include \<sys\/select.h\>" common/Socket_unix.cpp \
  && cmake . -DBUILD_LIBTELLDUS-CORE=ON -DBUILD_TDADMIN=OFF -DBUILD_TDTOOL=ON -DGENERATE_MAN=OFF -DFORCE_COMPILE_FROM_TRUNK=ON -DFTDI_LIBRARY=/usr/lib/libftdi1.so \
  && make \
  && make install \
  && apk del .build-dependencies \
  && rm -rf /usr/src/telldus

WORKDIR /usr
ADD run.sh ./run.sh
RUN chmod a+x ./run.sh

EXPOSE 50800 50801

CMD [ "./run.sh" ]