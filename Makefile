.PHONY:	all lint test

SRC_ROOT=./lib
TEST_ROOT=./test

all:	lint test

lint:
	@find $(SRC_ROOT) -name '*.js' -exec jslint {} \;

test:
	@find $(TEST_ROOT) -name 'test-*.js' -exec nodeunit {} \;
