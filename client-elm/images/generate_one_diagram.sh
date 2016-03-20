#!/bin/bash
EXT=svg
UGLY=ugly.svg
SRC=$1
DEST=$(echo $SRC | sed -e 's/src\//eps\//' -e "s/\.dot$/.$EXT/") && \
PNG=$(echo $DEST | sed -e "s/\.$EXT/.png/") && \
echo $SRC '->' $UGLY &&\
dot -T$EXT -Nshape=record -Nmargin=0.05 -Nfontsize=12pt -Nfontname=serif -Efontsize=12pt -Efontname=serif -Ecolor=maroon -Efontcolor=navy -Gnodesep=0.2 -o $UGLY $SRC && \
#echo "$UGLY + prettyup.xsl = $DEST" && \
#xsltproc prettyup.xsl $UGLY > $DEST && \
#echo $DEST '->' $PNG && \
#convert $DEST $PNG && \
convert $UGLY $PNG && \
echo 'Cleanup..' && \
rm $UGLY && \
echo 'Done.'
